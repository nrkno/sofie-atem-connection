jest.mock('dgram')
import { Socket } from '../__mocks__/dgram'
import { AtemSocketChild } from '../atemSocketChild'
import { Util } from '../..'
import * as lolex from 'lolex'
import { ConnectionState, PacketFlag, IPCMessageType } from '../../enums'

const ADDRESS = '127.0.0.1'

function getSocket (child: AtemSocketChild) {
	const socket = (child as any)._socket as Socket
	expect(socket).toBeTruthy()
	expect(socket.isOpen).toBeTruthy()
	socket.expectedAddress = ADDRESS
	socket.expectedPort = 9910

	return socket
}
function getState (child: AtemSocketChild) {
	return (child as any)._connectionState as ConnectionState
}
function fakeConnect (child: AtemSocketChild) {
	const child2 = child as any
	child2._connectionState = ConnectionState.Established
	child2._address = '127.0.0.1'
}

describe('SocketChild', () => {
	let clock: lolex.InstalledClock
	beforeEach(() => {
		clock = lolex.install()
	})
	afterEach(() => {
		clock.uninstall()
	})

	test('Establish connection', async () => {
		const child = new AtemSocketChild()
		try {
			const socket = getSocket(child)

			let receivedPacket = false
			socket.sendImpl = (msg: Buffer) => {
				if (!receivedPacket) {
					expect(msg).toEqual(Util.COMMAND_CONNECT_HELLO)
					receivedPacket = true
				} else {
					// Shouldnt get any other sends
					expect(false).toBeTruthy()
				}
			}

			expect(getState(child)).toEqual(ConnectionState.Closed)
			child.connect(ADDRESS)

			// Ensure everything has ticked through
			clock.tick(20)

			// Confirm something was sent
			expect(receivedPacket).toBeTruthy()
			expect(getState(child)).toEqual(ConnectionState.SynSent)

			receivedPacket = false
			socket.sendImpl = (msg: Buffer) => {
				if (!receivedPacket) {
					expect(msg).toEqual(Buffer.from([
						0x80, 0x0C, 0x53, 0x1B,
						0x00, 0x00, 0x00, 0x00,
						0x00, 0x00, 0x00, 0x00
					]))
					receivedPacket = true
				} else {
					// Shouldnt get any other sends
					expect(false).toBeTruthy()
				}
			}

			// Now get the connection established
			socket.emitMessage(Buffer.from([
				0x10, 0x14, // Length & Type
				0x53, 0x1b, // Session Id
				0x00, 0x00, // Not acking
				0x00, 0x00, // Not asking for retransmit
				0x00, 0xd1, // 'Client pkt id' Not sure why this
				0x00, 0x00, // Packet Id
				0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 // Unknown Payload
			]))

			// Ensure everything has ticked through
			clock.tick(20)

			// Confirm something was sent
			expect(receivedPacket).toBeTruthy()
			expect(getState(child)).toEqual(ConnectionState.Established)

		} finally {
			if (child) {
				// Try and cleanup any timers
				await child.disconnect()
			}
		}
	})

	function genAckRequestMessage (pktId: number, extraLength?: number) {
		const buffer = Buffer.from([
			0x08, 0x0c + (extraLength || 0), // Length & Type
			0x53, 0x1b, // Session Id
			0x00, 0x00, // Not acking
			0x00, 0x00, // Not asking for retransmit
			0x00, 0x00, // 'Client pkt id' Not needed
			0x00, 0x00 // Packet Id
		])
		buffer.writeUInt16BE(pktId, 10) // Packet Id

		return buffer
	}

	test('Ack - delayed', async () => {
		const child = new AtemSocketChild()
		try {
			fakeConnect(child)
			const socket = getSocket(child)

			const acked: number[] = []
			let gotUnknown = false
			socket.sendImpl = (msg: Buffer) => {
				const opcode = msg.readUInt8(0) >> 3
				if (opcode & PacketFlag.AckReply) {
					acked.push(msg.readUInt16BE(4))
				} else {
					gotUnknown = true
					// Shouldnt get any other sends
					expect(false).toBeTruthy()
				}
			}

			socket.emitMessage(genAckRequestMessage(1))

			// Nothing should have been sent immediately
			expect(acked).toEqual([])
			expect(gotUnknown).toBeFalse()

			// Still nothing sent
			clock.tick(4)
			expect(acked).toEqual([])
			expect(gotUnknown).toBeFalse()

			// Should be an ack a little later
			clock.tick(10)
			expect(acked).toEqual([1])
			expect(gotUnknown).toBeFalse()

		} finally {
			if (child) {
				// Try and cleanup any timers
				await child.disconnect()
			}
		}
	})

	test('Ack - bulk', async () => {
		const child = new AtemSocketChild()
		try {
			fakeConnect(child)
			const socket = getSocket(child)

			let acked: number[] = []
			let gotUnknown = false
			socket.sendImpl = (msg: Buffer) => {
				const opcode = msg.readUInt8(0) >> 3
				if (opcode & PacketFlag.AckReply) {
					acked.push(msg.readUInt16BE(4))
				} else {
					gotUnknown = true
					// Shouldnt get any other sends
					expect(false).toBeTruthy()
				}
			}

			for (let i = 1; i <= 15; i++) {
				socket.emitMessage(genAckRequestMessage(i))
			}

			// Nothing should have been sent yet
			clock.tick(4)
			expect(acked).toEqual([])
			expect(gotUnknown).toBeFalse()

			// One more will trigger an ack
			socket.emitMessage(genAckRequestMessage(16))
			expect(acked).toEqual([16])
			expect(gotUnknown).toBeFalse()
			acked = []

			// Nothing more should be acked
			clock.tick(10)
			expect(acked).toEqual([])
			expect(gotUnknown).toBeFalse()

		} finally {
			if (child) {
				// Try and cleanup any timers
				await child.disconnect()
			}
		}
	})

	test('Inbound commands', async () => {
		const child = new AtemSocketChild()
		try {
			fakeConnect(child)
			const socket = getSocket(child)

			let gotUnknown = false
			socket.sendImpl = (_msg: Buffer) => {
				gotUnknown = true
				// Shouldnt get any other sends
				expect(false).toBeTruthy()
			}

			let gotCmds: number[] = []
			child.on(IPCMessageType.InboundCommand, buf => gotCmds.push(buf.length))

			// Nothing
			socket.emitMessage(genAckRequestMessage(1))
			expect(gotCmds).toEqual([])
			expect(gotUnknown).toBeFalse()

			// Some payload
			const buffer = Buffer.concat([genAckRequestMessage(2, 1), Buffer.from([0])])
			socket.emitMessage(buffer)
			expect(gotCmds).toEqual([1])
			expect(gotUnknown).toBeFalse()
			gotCmds = []

			// Repeated should not re-emit
			socket.emitMessage(buffer)
			expect(gotCmds).toEqual([])
			expect(gotUnknown).toBeFalse()

			// Previous should not re-emit
			socket.emitMessage(Buffer.concat([genAckRequestMessage(1, 1), Buffer.from([0])]))
			expect(gotCmds).toEqual([])
			expect(gotUnknown).toBeFalse()

			// Another payload
			socket.emitMessage(Buffer.concat([genAckRequestMessage(3, 1), Buffer.from([0])]))
			expect(gotCmds).toEqual([1])
			expect(gotUnknown).toBeFalse()
			gotCmds = []

		} finally {
			if (child) {
				// Try and cleanup any timers
				await child.disconnect()
			}
		}
	})

	test('Inbound commands - around wrap', async () => {
		const child = new AtemSocketChild()
		try {
			fakeConnect(child)
			const socket = getSocket(child)
			; (child as any)._lastReceivedPacketId = 32766 // 32767 is max

			let gotUnknown = false
			socket.sendImpl = (_msg: Buffer) => {
				gotUnknown = true
				// Shouldnt get any other sends
				expect(false).toBeTruthy()
			}

			let gotCmds: number[] = []
			child.on(IPCMessageType.InboundCommand, buf => gotCmds.push(buf.length))

			// Nothing
			socket.emitMessage(Buffer.concat([genAckRequestMessage(32766, 1), Buffer.from([0])]))
			expect(gotCmds).toEqual([])
			expect(gotUnknown).toBeFalse()

			// Some payload
			const lastBuffer = Buffer.concat([genAckRequestMessage(32767, 1), Buffer.from([0])])
			socket.emitMessage(lastBuffer)
			expect(gotCmds).toEqual([1])
			expect(gotUnknown).toBeFalse()
			gotCmds = []

			// Should not re-emit
			socket.emitMessage(lastBuffer)
			expect(gotCmds).toEqual([])
			expect(gotUnknown).toBeFalse()
			gotCmds = []

			// Now it has wrapped
			const firstBuffer = Buffer.concat([genAckRequestMessage(0, 1), Buffer.from([0])])
			socket.emitMessage(firstBuffer)
			expect(gotCmds).toEqual([1])
			expect(gotUnknown).toBeFalse()
			gotCmds = []

			// Next buffer
			socket.emitMessage(Buffer.concat([genAckRequestMessage(1, 1), Buffer.from([0])]))
			expect(gotCmds).toEqual([1])
			expect(gotUnknown).toBeFalse()
			gotCmds = []

			// Should not re-emit
			socket.emitMessage(firstBuffer)
			expect(gotCmds).toEqual([])
			expect(gotUnknown).toBeFalse()
			gotCmds = []

			// Retransmit of lastBuffer is not uncommon, it should not re-emit
			socket.emitMessage(lastBuffer)
			expect(gotCmds).toEqual([])
			expect(gotUnknown).toBeFalse()
			gotCmds = []

			// Ensure that the first buffer still does not re-emit
			socket.emitMessage(firstBuffer)
			expect(gotCmds).toEqual([])
			expect(gotUnknown).toBeFalse()
			gotCmds = []

		} finally {
			if (child) {
				// Try and cleanup any timers
				await child.disconnect()
			}
		}
	})

})
