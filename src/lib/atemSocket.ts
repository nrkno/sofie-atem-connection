import { createSocket, /*AddressInfo,*/ Socket } from 'dgram'
import { EventEmitter } from 'events'
import { Util } from './atemUtil'

export enum ConnectionState {
	None = 0x00,
	SynSent = 0x01,
	Established = 0x02,
	Closed = 0x03
}

export enum PacketFlag {
	AckRequest = 0x01, // Ack called by Skaarhoj
	Connect = 0x02, // Init called by Skaarhoj
	Repeat = 0x04,
	Error = 0x08,
	AckReply = 0x16
}

export class AtemSocket extends EventEmitter {
	private _connectionState = ConnectionState.Closed

	private _localPacketId = 0
	private _maxPacketID = 1 << 15 // Atem expects 15 not 16 bits before wrapping
	private _sessionId: Array<number>
	// private _remotePacketId: Array<number>

	private _address: string
	private _port: number = 9910
	private _socket: Socket
	private _reconnectInterval = 500

	// private _maxInFlight = 10
	private _inFlightTimeout = 200
	private _lastReceivedAt: number = Date.now()
	private _inFlight: Array<{packetId: number, lastSent: number, packet: Buffer}> = []

	constructor (address: string, port: number) {
		super()
		this._address = address
		this._port = port

		this._socket = createSocket('udp4')
		this._socket.bind(this._port + 1)
		this._socket.on('message', (packet) => this._receivePacket(packet))

		setInterval(() => {
			if (this._lastReceivedAt + this._reconnectInterval > Date.now()) return
			if (this._connectionState === ConnectionState.Established) {
				this._connectionState = ConnectionState.Closed
				this.emit('disconnect', null, null)
			}
			this._localPacketId = 1
			this._sessionId = []
			this.connect(this._address, this._port)
		}, this._reconnectInterval)

		setInterval(() => this._checkForRetransmit(), 50)
	}

	public connect (address?: string, port?: number) {
		if (address) {
			this._address = address
		}
		if (port) {
			this._port = port
		}

		this._sendPacket(Util.COMMAND_CONNECT_HELLO)
		this._connectionState = ConnectionState.SynSent
	}

	public log (args: any): void {
		// fallback, should be remapped by Atem class
		console.log(args)
	}

	public _sendCommand (command: string, payload: string | Buffer) {
		if (!Buffer.isBuffer(payload)) payload = new Buffer(payload)
		// console.log(command)

		let buffer = new Buffer(20 + payload.length)
		buffer.fill(0)

		buffer[0] = (20 + payload.length) / 256 | 0x08
		buffer[1] = (20 + payload.length) % 256
		buffer[2] = this._sessionId[0]
		buffer[3] = this._sessionId[1]
		buffer[10] = this._localPacketId / 256
		buffer[11] = this._localPacketId % 256
		buffer[12] = (8 + payload.length) / 256
		buffer[13] = (8 + payload.length) % 256
		buffer[16] = command.charCodeAt(0)
		buffer[17] = command.charCodeAt(1)
		buffer[18] = command.charCodeAt(2)
		buffer[19] = command.charCodeAt(3)

		payload.copy(buffer, 20)
		this._sendPacket(buffer)

		this._inFlight.push({ packetId: this._localPacketId, lastSent: Date.now(), packet: buffer })
		console.log(this._localPacketId)
		this._localPacketId++
		if (this._maxPacketID < this._localPacketId) this._localPacketId = 0
	}

	private _receivePacket (packet: Buffer) {
		let length = ((packet[0] & 0x07) << 8) | packet[1]
		// this._lastReceivedAt = Date.now()
		// if (length !== remote.length) return

		if (packet[0] > 16) return
		let flags = packet[0] >> 3
		this._sessionId = [packet[2], packet[3]]
		let remotePacketId = packet[10] << 8 | packet[11]
		// console.log(packet[10], packet[11])

		// Send hello answer packet when receive connect flags
		if (flags & PacketFlag.Connect && !(flags & PacketFlag.Repeat)) {
			// console.log('hello answer', packet, this._connectionState)
			this._sendPacket(Util.COMMAND_CONNECT_HELLO_ANSWER)
		}

		// Parse commands, Emit 'stateChanged' event after parse
		if (flags & PacketFlag.AckRequest && length > 12) {
			// console.log('Parse command')
			this._parseCommand(packet.slice(12))
		}

		// Send ping packet, Emit 'connect' event after receive all stats
		if (flags & PacketFlag.AckRequest && length === 12 && this._connectionState === ConnectionState.SynSent) {
			// console.log('set connected', packet)
			this._connectionState = ConnectionState.Established
			this.emit('connect')
		}

		// Send ack packet (called by answer packet in Skaarhoj)
		if (flags & PacketFlag.AckRequest && this._connectionState === ConnectionState.Established) {
			// console.log('send ack', remotePacketId)
			this._sendAck(remotePacketId)
			this.emit('ping')
		}

		if (flags & PacketFlag.AckReply && this._connectionState === ConnectionState.Established) {
			// console.log(packet, this._localPacketId)
			// console.log('command acked', packet)
			for (let i in this._inFlight) {
				if (remotePacketId === this._inFlight[i].packetId) {
					// console.log(this._inFlight[i])
					delete this._inFlight[i]
				}
			}
			// this._sendAck(remotePacketId)
		}
	}

	private _parseCommand (buffer: Buffer) {
		let length = Util.parseNumber(buffer.slice(0, 2))
		let name = Util.parseString(buffer.slice(4, 8))

		// console.log('COMMAND', `${name}(${length})`, buffer.slice(0, length))

		this.emit('receivedStateChange', name, buffer.slice(0, length).slice(8))
		if (buffer.length > length) {
			this._parseCommand(buffer.slice(length))
		}
	}

	private _sendPacket (packet: Buffer) {
		console.log('SEND', packet)

		this._socket.send(packet, 0, packet.length, this._port, this._address)
	}

	private _sendAck (packetId: number) {
		let buffer = new Buffer(12)
		buffer.fill(0)
		buffer[0] = 0x80
		buffer[1] = 0x0C
		buffer[2] = this._sessionId[0]
		buffer[3] = this._sessionId[1]
		buffer[10] = packetId / 256
		buffer[11] = packetId % 256
		buffer[9] = 0x41
		this._sendPacket(buffer)
	}

	private _checkForRetransmit () {
		for (let sentPacket of this._inFlight) {
			if (sentPacket && sentPacket.lastSent + this._inFlightTimeout < Date.now()) {
				sentPacket.lastSent = Date.now()
				this._sendPacket(sentPacket.packet)
			}
		}
	}

}
