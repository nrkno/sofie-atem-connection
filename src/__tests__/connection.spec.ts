import { readFileSync } from 'fs'
import { resolve } from 'path'
import { AtemSocketChild } from '../lib/atemSocketChild'
import { ThreadedClass } from 'threadedclass'
import { BasicAtem } from '../atem'
import { InvalidIdError } from '../state'
jest.mock('../lib/atemSocketChild')

// @ts-ignore
export class AtemSocketChildMock implements AtemSocketChild {
	public onDisconnect: () => Promise<void>
	public onLog: (message: string) => Promise<void>
	public onCommandsReceived: (payload: Buffer, packetId: number) => Promise<void>
	public onCommandsAcknowledged: (ids: Array<{ packetId: number, trackingId: number }>) => Promise<void>

	constructor (onDisconnect: () => Promise<void>, onLog: (message: string) => Promise<void>, onCommandsReceived: (payload: Buffer, packetId: number) => Promise<void>, onCommandsAcknowledged: (ids: Array<{ packetId: number, trackingId: number }>) => Promise<void>) {
		this.onDisconnect = onDisconnect
		this.onLog = onLog
		this.onCommandsReceived = onCommandsReceived
		this.onCommandsAcknowledged = onCommandsAcknowledged
	}

	public restartConnection () {
		return Promise.resolve()
	}
	public log (message: string) {
		console.log(message)
	}

	public connect = jest.fn(() => Promise.resolve())
	public disconnect = jest.fn(() => Promise.resolve())
	public sendCommands = jest.fn(() => Promise.resolve())
}

(AtemSocketChild as any).mockImplementation((_opts: any, onDisconnect: () => Promise<void>, onLog: (message: string) => Promise<void>, onCommandsReceived: (payload: Buffer, packetId: number) => Promise<void>, onCommandsAcknowledged: (ids: Array<{ packetId: number, trackingId: number }>) => Promise<void>) => {
	return new AtemSocketChildMock(onDisconnect, onLog, onCommandsReceived, onCommandsAcknowledged)
})

function createConnection () {
	return new BasicAtem({
		debugBuffers: false,
		address: '',
		port: 890,
		disableMultithreaded: true
	})
}

function getChild (conn: BasicAtem): ThreadedClass<AtemSocketChildMock> {
	return (conn as any).socket._socketProcess
}

function runTestMe1 (name: string, filename: string) {
	const filePath = resolve(__dirname, `./connection/${filename}.data`)
	const fileData = readFileSync(filePath).toString().split('\n')

	test(`${name}`, async () => {
		const conn = createConnection()
		await conn.connect('')

		const child = getChild(conn)
		expect(child).toBeTruthy()
		expect(child.onCommandsReceived).toBeTruthy()

		const errors: any[] = []
		conn.on('error', (e: any) => {
			// Ignore any errors that are due to bad ids, as they are 'good' errors
			if (!(e instanceof InvalidIdError)) {
				errors.push(e)
			}
		})

		for (const i in fileData) {
			const buffer = Buffer.from(fileData[i].trim(), 'hex')
			await child.onCommandsReceived(buffer, i)
		}

		expect(errors).toEqual([])

		// console.log(conn.state)
	})
}

describe('connection', () => {
	/**
	 * Test cases can be generated with the dump.js script.
	 * These tests run the payload through the parser to ensure that the commands does not error.
	 */

	runTestMe1('ps4k v7.2', 'ps4k-v7.2')
	runTestMe1('4me4k v7.5.2', '4me4k-v7.5.2')
	runTestMe1('tvshd v8.0.0', 'tvshd-v8.0.0')
	runTestMe1('constellation v8.0.2', 'constellation-v8.0.2')
	runTestMe1('2me v8.1', '2me-v8.1')
	runTestMe1('mini v8.1', 'mini-v8.1')
	runTestMe1('1me v8.1', '1me-v8.1')
})
