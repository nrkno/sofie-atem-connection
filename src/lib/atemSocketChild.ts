import { createSocket, Socket, RemoteInfo } from 'dgram'
import { EventEmitter } from 'events'
import { Util } from './atemUtil'
import { ConnectionState, IPCMessageType, PacketFlag } from '../enums'
import * as NanoTimer from 'nanotimer'
import { DEFAULT_PORT } from '../atem'

const IN_FLIGHT_TIMEOUT = 30 // ms
const CONNECTION_TIMEOUT = 5000 // ms
const CONNECTION_RETRY_INTERVAL = 1000 // ms
const MAX_PACKET_RETRIES = 5
const MAX_PACKET_ID = (1 << 15) // Atem expects 15 not 16 bits before wrapping
const MAX_PACKET_PER_ACK = 16

interface InFlightPacket {
	readonly packetId: number
	readonly trackingId: number
	readonly payload: Buffer
	lastSent: number
	resent: number
}

export class AtemSocketChild extends EventEmitter {
	private readonly _debug = false

	private _connectionState = ConnectionState.Closed
	private _reconnectTimer: NodeJS.Timer | undefined
	private _retransmitTimer: NodeJS.Timer | undefined

	private _nextSendPacketId = 1
	private _sessionId: number = 0

	private _address: string
	private _port: number = DEFAULT_PORT
	private _socket: Socket

	private _lastReceivedAt: number = Date.now()
	private _lastReceivedPacketId: number = 0
	private _inFlight: InFlightPacket[] = []
	private readonly _ackTimer = new NanoTimer()
	private _ackTimerRunning = false
	private _receivedWithoutAck: number = 0

	public on!: ((event: IPCMessageType.Disconnect, listener: () => void) => this) &
		((event: IPCMessageType.Log, listener: (payload: string) => void) => this) &
		((event: IPCMessageType.InboundCommand, listener: (payload: Buffer, packetId: number) => void) => this) &
		((event: IPCMessageType.CommandAcknowledged, listener: (packetId: number, trackingId: number) => void) => this) &
		((event: IPCMessageType.CommandReject, listener: (packetId: number, trackingId: number) => void) => this)

	public emit!: ((event: IPCMessageType.Disconnect) => boolean) &
		  ((event: IPCMessageType.Log, payload: string) => boolean) &
		  ((event: IPCMessageType.InboundCommand, payload: Buffer, packetId: number) => boolean) &
		  ((event: IPCMessageType.CommandAcknowledged, packetId: number, trackingId: number) => boolean) &
		  ((event: IPCMessageType.CommandReject, packetId: number, trackingId: number) => boolean)

	constructor (options: { address?: string, port?: number } = {}) {
		super()
		this._address = options.address || ''
		this._port = options.port || this._port
		this._socket = this._createSocket()
	}

	public connect (address?: string, port?: number): void {
		if (!this._reconnectTimer) {
			this._reconnectTimer = setInterval(() => {
				if (this._lastReceivedAt + CONNECTION_TIMEOUT > Date.now()) {
					// We heard from the atem recently
					return
				}

				this.restartConnection()
			}, CONNECTION_RETRY_INTERVAL)
		}
		// Check for retransmits every 10 milliseconds
		if (!this._retransmitTimer) {
			this._retransmitTimer = setInterval(() => this._checkForRetransmit(), 10)
		}

		if (address) {
			this._address = address
		}
		if (port) {
			this._port = port
		}

		this.restartConnection()
	}

	public disconnect (): Promise<void> {
		// Stop timers, as they just cause pointless work now.
		if (this._retransmitTimer) {
			clearInterval(this._retransmitTimer)
			this._retransmitTimer = undefined
		}
		if (this._reconnectTimer) {
			clearInterval(this._reconnectTimer)
			this._reconnectTimer = undefined
		}

		return new Promise((resolve) => {
			try {
				this._socket.close(() => resolve())
			} catch (e) {
				resolve()
			}
		}).then(() => {
			this._connectionState = ConnectionState.Closed
			this._createSocket()
			this.emit(IPCMessageType.Disconnect)
		})
	}

	public restartConnection (): void {
		// This includes a 'disconnect'
		if (this._connectionState === ConnectionState.Established) {
			this._connectionState = ConnectionState.Closed
			this.emit(IPCMessageType.Disconnect)
		}

		// Reset connection
		this._nextSendPacketId = 1
		this._sessionId = 0
		this._inFlight = []
		this.log('reconnect')

		// Try doing reconnect
		if (this._address && this._port) {
			this._sendPacket(Util.COMMAND_CONNECT_HELLO)
			this._connectionState = ConnectionState.SynSent
		}
	}

	public log (payload: string): void {
		this.emit(IPCMessageType.Log, payload)
	}

	public sendCommand (payload: Buffer, trackingId: number): void {
		const packetId = this._nextSendPacketId++
		if (this._nextSendPacketId >= MAX_PACKET_ID) this._nextSendPacketId = 0

		const opcode = PacketFlag.AckRequest << 11

		if (this._debug) this.log(`SEND ${payload}`)
		const buffer = Buffer.alloc(12 + payload.length, 0)
		buffer.writeUInt16BE(opcode | (payload.length + 12), 0) // Opcode & Length
		buffer.writeUInt16BE(this._sessionId, 2)
		buffer.writeUInt16BE(packetId, 10)

		payload.copy(buffer, 12)
		this._sendPacket(buffer)

		this._inFlight.push({
			packetId,
			trackingId,
			lastSent: Date.now(),
			payload: buffer,
			resent: 0
		})
	}

	private _createSocket () {
		this._socket = createSocket('udp4')
		this._socket.bind()
		this._socket.on('message', (packet, rinfo) => this._receivePacket(packet, rinfo))
		this._socket.on('error', err => {
			this.log(`Connection error: ${err}`)

			if (this._connectionState === ConnectionState.Established) {
				// If connection is open, then restart. Otherwise the reconnectTimer will handle it
				this.restartConnection()
			}
		})

		return this._socket
	}

	private _isPacketCoveredByAck (ackId: number, packetId: number) {
		const tolerance = MAX_PACKET_ID / 2
		const pktIsShortlyBefore = packetId < ackId && packetId + tolerance > ackId
		const pktIsShortlyAfter = packetId > ackId && packetId < ackId + tolerance
		const pktIsBeforeWrap = packetId > ackId + tolerance
		return packetId === ackId || ((pktIsShortlyBefore || pktIsBeforeWrap) && !pktIsShortlyAfter)
	}

	private _receivePacket (packet: Buffer, rinfo: RemoteInfo) {
		if (this._debug) this.log(`RECV ${packet}`)
		this._lastReceivedAt = Date.now()
		const length = packet.readUInt16BE(0) & 0x07ff
		if (length !== rinfo.size) return

		const flags = packet.readUInt8(0) >> 3
		this._sessionId = packet.readUInt16BE(2)
		const remotePacketId = packet.readUInt16BE(10)

		// Send hello answer packet when receive connect flags
		if (flags & PacketFlag.Connect) {
			this._connectionState = ConnectionState.Established
			this._lastReceivedPacketId = remotePacketId
			this._sendAck(remotePacketId)
			return
		}

		if (this._connectionState === ConnectionState.Established) {
			// Device asked for retransmit
			if (flags & PacketFlag.RetransmitRequest) {
				const fromPacketId = packet.readUInt16BE(6)
				this.log(`Retransmit request: ${fromPacketId}`)

				// TODO - enable and test this
				// this._checkForRetransmit(fromPacketId)
			}

			// Got a packet that needs an ack
			if (flags & PacketFlag.AckRequest) {
				// Check if it next in the sequence
				if (remotePacketId === (this._lastReceivedPacketId + 1) % MAX_PACKET_ID) {
					this._lastReceivedPacketId = remotePacketId
					this._sendOrQueueAck()

					// It might have commands
					if (length > 12) {
						this.emit(IPCMessageType.InboundCommand, packet.slice(12), remotePacketId)
					}
				} else if (this._isPacketCoveredByAck(this._lastReceivedPacketId, remotePacketId)) {
					// We got a retransmit of something we have already acked, so reack it
					this._sendOrQueueAck()
				}
			}

			// Device ack'ed our packet
			if (flags & PacketFlag.AckReply) {
				const ackPacketId = packet.readUInt16BE(4)
				this._inFlight = this._inFlight.filter(pkt => {
					if (this._isPacketCoveredByAck(ackPacketId, pkt.packetId)) {
						this.emit(IPCMessageType.CommandAcknowledged, pkt.packetId, pkt.trackingId)
						return false
					} else {
						// Not acked yet
						return true
					}
				})
			}
		}
	}

	private _sendPacket (packet: Buffer) {
		if (this._debug) this.log(`SEND ${packet}`)
		this._socket.send(packet, 0, packet.length, this._port, this._address)
	}

	private _sendOrQueueAck () {
		this._receivedWithoutAck++
		if (this._receivedWithoutAck >= MAX_PACKET_PER_ACK) {
			this._receivedWithoutAck = 0
			this._ackTimerRunning = false
			this._ackTimer.clearTimeout()
			this._sendAck(this._lastReceivedPacketId)
		} else if (!this._ackTimerRunning) {
			this._ackTimerRunning = true
			// timeout for 5 ms (syntax for nanotimer says m)
			this._ackTimer.setTimeout(() => {
				this._receivedWithoutAck = 0
				this._ackTimerRunning = false
				this._sendAck(this._lastReceivedPacketId)
			}, [], '5m')
		}
	}

	private _sendAck (packetId: number) {
		const opcode = PacketFlag.AckReply << 11
		const length = 12
		const buffer = Buffer.alloc(length, 0)
		buffer.writeUInt16BE(opcode | length, 0)
		buffer.writeUInt16BE(this._sessionId, 2)
		buffer.writeUInt16BE(packetId, 4)
		this._sendPacket(buffer)
	}

	private _checkForRetransmit (retransmitFromPacketId?: number) {
		this._inFlight = this._inFlight.filter(sentPacket => {
			if (retransmitFromPacketId && sentPacket.packetId > retransmitFromPacketId) {
				sentPacket.lastSent = Date.now()
				sentPacket.resent++
				this._sendPacket(sentPacket.payload)
			} else if (sentPacket && sentPacket.lastSent + IN_FLIGHT_TIMEOUT < Date.now()) {
				if (sentPacket.resent <= MAX_PACKET_RETRIES && this._isPacketCoveredByAck(this._nextSendPacketId, sentPacket.packetId)) {
					sentPacket.lastSent = Date.now()
					sentPacket.resent++

					this.log(`Resending ${sentPacket.packetId}`)
					if (this._debug) {
						this.log(`RESEND: ${sentPacket}`)
					}
					this._sendPacket(sentPacket.payload)
					retransmitFromPacketId = sentPacket.packetId
				} else {
					this.emit(IPCMessageType.CommandReject, sentPacket.packetId, sentPacket.trackingId)

					this.log(`Timed out: ${sentPacket.packetId}`)
					if (this._debug) {
						this.log(`TIMED OUT: ${sentPacket}`)
					}
					// @todo: we should probably break up the connection here.

					// Discard
					return false
				}
			}

			return true
		})
	}
}
