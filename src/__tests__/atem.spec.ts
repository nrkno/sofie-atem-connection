import { Atem, DEFAULT_PORT } from '../atem'
import { cleanupAtem } from './lib'
import { CutCommand } from '../commands'
import { IPCMessageType } from '../enums'
import { promisify } from 'util'
import { EventEmitter } from 'events'

import { AtemSocket } from '../lib/atemSocket'
jest.mock('../lib/atemSocket.ts')

const setImmediatePromise = promisify(setImmediate)

describe('Atem', () => {
	beforeEach(() => {
		(AtemSocket as any).mockClear()
	})

	test('constructor test 1', async () => {
		const conn = new Atem({ disableMultithreaded: true, externalLog: () => null })

		try {
			const socket = (conn as any).socket as AtemSocket
			expect(socket).toBeTruthy()

			expect(AtemSocket).toHaveBeenCalledTimes(1)
			expect(AtemSocket).toHaveBeenCalledWith({
				address: '',
				debug: false,
				disableMultithreaded: true,
				log: (conn as any)._log,
				port: DEFAULT_PORT
			})
		} finally {
			cleanupAtem(conn)
		}
	})
	test('constructor test 2', async () => {
		const conn = new Atem({ debug: true, address: 'test1', port: 23 })

		try {
			const socket = (conn as any).socket as AtemSocket
			expect(socket).toBeTruthy()

			expect(AtemSocket).toHaveBeenCalledTimes(1)
			expect(AtemSocket).toHaveBeenCalledWith({
				address: 'test1',
				debug: true,
				disableMultithreaded: false,
				log: (conn as any)._log,
				port: 23
			})
		} finally {
			cleanupAtem(conn)
		}
	})

	test('connect', async () => {
		const conn = new Atem({ debug: true, address: 'test1', port: 23 })

		try {
			const socket = (conn as any).socket as AtemSocket
			expect(socket).toBeTruthy()

			socket.connect = jest.fn(() => Promise.resolve(5) as any)

			const res = conn.connect('127.9.8.7', 98)
			expect(await res).toEqual(5)

			expect(socket.connect).toHaveBeenCalledTimes(1)
			expect(socket.connect).toHaveBeenCalledWith('127.9.8.7', 98)

		} finally {
			cleanupAtem(conn)
		}
	})

	test('disconnect', async () => {
		const conn = new Atem({ debug: true, address: 'test1', port: 23 })

		try {
			const socket = (conn as any).socket as AtemSocket
			expect(socket).toBeTruthy()

			socket.disconnect = jest.fn(() => Promise.resolve(35) as any)

			const res = await conn.disconnect()
			expect(res).toEqual(35)

			expect(socket.disconnect).toHaveBeenCalledTimes(1)
			expect(socket.disconnect).toHaveBeenCalledWith()

		} finally {
			cleanupAtem(conn)
		}
	})

	test('sendCommand - good', async () => {
		(AtemSocket as any).mockImplementation(() => new EventEmitter())
		const conn = new Atem({ debug: true, address: 'test1', port: 23 })

		try {
			const socket = (conn as any).socket as AtemSocket
			expect(socket).toBeTruthy()

			let nextTrackId = 123
			Object.defineProperty(socket, 'nextCommandTrackingId', {
				get: jest.fn(() => nextTrackId++),
				set: jest.fn()
			})
			expect(socket.nextCommandTrackingId).toEqual(123)

			socket._sendCommand = jest.fn(() => Promise.resolve(35) as any)

			const sentQueue = (conn as any)._sentQueue as object
			expect(Object.keys(sentQueue)).toHaveLength(0)

			const cmd = new CutCommand(0)
			const res = conn.sendCommand(cmd)
			await setImmediatePromise()
			expect(Object.keys(sentQueue)).toHaveLength(1)

			expect(socket._sendCommand).toHaveBeenCalledTimes(1)
			expect(socket._sendCommand).toHaveBeenCalledWith(cmd, 124)

			// Trigger the ack, and it should switfy resolve
			socket.emit(IPCMessageType.CommandAcknowledged, { trackingId: 124 })
			expect(Object.keys(sentQueue)).toHaveLength(0)

			// Finally, it should now resolve without a timeout
			expect(await res).toEqual(cmd)
		} finally {
			cleanupAtem(conn)
		}
	}, 500)

	test('sendCommand - timeout', async () => {
		(AtemSocket as any).mockImplementation(() => new EventEmitter())
		const conn = new Atem({ debug: true, address: 'test1', port: 23 })

		try {
			const socket = (conn as any).socket as AtemSocket
			expect(socket).toBeTruthy()

			let nextTrackId = 123
			Object.defineProperty(socket, 'nextCommandTrackingId', {
				get: jest.fn(() => nextTrackId++),
				set: jest.fn()
			})
			expect(socket.nextCommandTrackingId).toEqual(123)

			socket._sendCommand = jest.fn(() => Promise.resolve(35) as any)

			const sentQueue = (conn as any)._sentQueue as object
			expect(Object.keys(sentQueue)).toHaveLength(0)

			const cmd = new CutCommand(0)
			const res = conn.sendCommand(cmd)
			await setImmediatePromise()
			expect(Object.keys(sentQueue)).toHaveLength(1)

			expect(socket._sendCommand).toHaveBeenCalledTimes(1)
			expect(socket._sendCommand).toHaveBeenCalledWith(cmd, 124)

			// Trigger the timeout, and it should switfy resolve
			socket.emit(IPCMessageType.CommandTimeout, { trackingId: 124 })
			expect(Object.keys(sentQueue)).toHaveLength(0)

			// Finally, it should now resolve without a timeout
			try {
				await res
				// Should not get here
				expect(false).toBeTruthy()
			} catch (e) {
				expect(e).toEqual(cmd)
			}
			// expect(await res).toEqual(cmd)
		} finally {
			cleanupAtem(conn)
		}
	}, 500)

	test('sendCommand - send error', async () => {
		(AtemSocket as any).mockImplementation(() => new EventEmitter())
		const conn = new Atem({ debug: true, address: 'test1', port: 23 })

		try {
			const socket = (conn as any).socket as AtemSocket
			expect(socket).toBeTruthy()

			let nextTrackId = 123
			Object.defineProperty(socket, 'nextCommandTrackingId', {
				get: jest.fn(() => nextTrackId++),
				set: jest.fn()
			})
			expect(socket.nextCommandTrackingId).toEqual(123)

			socket._sendCommand = jest.fn(() => Promise.reject(35) as any)

			const sentQueue = (conn as any)._sentQueue as object
			expect(Object.keys(sentQueue)).toHaveLength(0)

			const cmd = new CutCommand(0)
			const res = conn.sendCommand(cmd)

			// Send command should be called
			expect(socket._sendCommand).toHaveBeenCalledTimes(1)
			expect(socket._sendCommand).toHaveBeenCalledWith(cmd, 124)

			expect(Object.keys(sentQueue)).toHaveLength(0)

			// Finally, it should now resolve without a timeout
			try {
				await res
				// Should not get here
				expect(false).toBeTruthy()
			} catch (e) {
				// Should be the error thrown by sendCommand
				expect(e).toEqual(35)
			}
			// expect(await res).toEqual(cmd)
		} finally {
			cleanupAtem(conn)
		}
	}, 500)

})
