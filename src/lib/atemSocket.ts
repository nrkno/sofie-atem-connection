import { EventEmitter } from 'events'
import { CommandParser } from './atemCommandParser'
import exitHook = require('exit-hook')
import { VersionCommand, ISerializableCommand, IDeserializedCommand } from '../commands'
import { DEFAULT_PORT } from '../atem'
import { threadedClass, ThreadedClass, ThreadedClassManager } from 'threadedclass'
import { AtemSocketChild } from './atemSocketChild'

export interface AtemSocketOptions {
	address: string
	port: number
	debug: boolean
	disableMultithreaded: boolean

	log: (...args: any[]) => void
}

export class AtemSocket extends EventEmitter {
	private readonly _debug: boolean
	private readonly _disableMultithreaded: boolean
	private readonly _commandParser: CommandParser = new CommandParser()

	private _nextCommandTrackingId = 0
	private _address: string
	private _port: number = DEFAULT_PORT
	private _socketProcess: ThreadedClass<AtemSocketChild> | undefined
	private _exitUnsubscribe?: () => void

	private readonly log: (args1: any, args2?: any, args3?: any) => void

	public on!: ((event: 'disconnect', listener: () => void) => this) &
		((event: 'connect', listener: () => void) => this) &
		((event: 'error', listener: (message: string) => void) => this) &
		((event: 'commandReceived', listener: (cmd: IDeserializedCommand) => void) => this) &
		((event: 'commandAck', listener: (trackingId: number) => void) => this)

	public emit!: ((event: 'disconnect') => boolean) &
		((event: 'connect') => boolean) &
		((event: 'error', message: string) => boolean) &
		((event: 'commandReceived', cmd: IDeserializedCommand) => boolean) &
		((event: 'commandAck', trackingId: number) => boolean)

	constructor (options: AtemSocketOptions) {
		super()
		this._address = options.address
		this._port = options.port
		this._debug = options.debug
		this._disableMultithreaded = options.disableMultithreaded
		this.log = options.log
	}

	public async connect (address?: string, port?: number): Promise<void> {
		if (address) {
			this._address = address
		}
		if (port) {
			this._port = port
		}

		if (!this._socketProcess) {
			this._socketProcess = await this._createSocketProcess()
			this._exitUnsubscribe = exitHook(() => this.destroy())
		} else {
			await this._socketProcess.connect(this._address, this._port)
		}
	}

	public async destroy () {
		await this.disconnect()
		if (this._socketProcess) {
			await ThreadedClassManager.destroy(this._socketProcess)
			this._socketProcess = undefined
		}
		if (this._exitUnsubscribe) {
			this._exitUnsubscribe()
			this._exitUnsubscribe = undefined
		}
	}

	public async disconnect (): Promise<void> {
		if (this._socketProcess) {
			await this._socketProcess.disconnect()
		}
	}

	get nextCommandTrackingId (): number {
		if (this._nextCommandTrackingId >= Number.MAX_SAFE_INTEGER) {
			this._nextCommandTrackingId = 0
		}
		return ++this._nextCommandTrackingId
	}

	public async sendCommand (command: ISerializableCommand, trackingId: number): Promise<void> {
		if (this._socketProcess) {
			if (typeof (command as any).serialize !== 'function') {
				throw new Error('Command is not serializable')
			}

			const payload = command.serialize(this._commandParser.version)
			const fullPayload = Buffer.alloc(payload.length + 8, 0)
			fullPayload.writeUInt16BE(fullPayload.length, 0)
			fullPayload.write((command.constructor as any).rawName, 4, 4)
			payload.copy(fullPayload, 8, 0)

			if (this._debug) this.log('PAYLOAD', command.constructor.name, fullPayload)

			await this._socketProcess.sendCommand(fullPayload, trackingId)
		} else {
			throw new Error('Socket process is not open')
		}
	}

	private async _createSocketProcess () {
		const socketProcess = await threadedClass<AtemSocketChild, typeof AtemSocketChild>('./atemSocketChild', AtemSocketChild, [
			{
				address: this._address,
				port: this._port,
				debug: this._debug
			},
			async () => { this.emit('disconnect') }, // onDisconnect
			async (message: string) => this.log(message), // onLog
			async (payload: Buffer) => this._parseCommand(Buffer.from(payload)), // onCommandReceived
			async (_packetId: number, trackingId: number) => { this.emit('commandAck', trackingId) } // onCommandAcknowledged
		], {
			instanceName: 'atem-connection',
			freezeLimit: 200,
			autoRestart: true,
			disableMultithreading: this._disableMultithreaded
		})

		ThreadedClassManager.onEvent(socketProcess, 'restarted', () => {
			this.emit('disconnect')
			this.connect().catch(error => {
				const errorMsg = `Failed to reconnect after respawning socket process: ${error}`
				this.emit('error', errorMsg)
			})
		})

		await socketProcess.connect(this._address, this._port)

		return socketProcess
	}

	private _parseCommand (buffer: Buffer) {
		if (buffer.length < 8) {
			// Commands are never less than 8, as that is the header
			return
		}

		const length = buffer.readUInt16BE(0)
		const name = buffer.toString('ascii', 4, 8)

		if (length < 8) {
			// Commands are never less than 8, as that is the header
			return
		}

		if (name === 'InCm') {
			this.emit('connect')
		}

		// this.log('COMMAND', `${name}(${length})`, buffer.slice(0, length))
		const cmdConstructor = this._commandParser.commandFromRawName(name)
		if (cmdConstructor && typeof cmdConstructor.deserialize === 'function') {
			try {
				const cmd: IDeserializedCommand = cmdConstructor.deserialize(buffer.slice(0, length).slice(8), this._commandParser.version)

				if (name === '_ver') { // init started
					const verCmd = cmd as VersionCommand
					this._commandParser.version = verCmd.properties.version
				}

				this.emit('commandReceived', cmd)
			} catch (e) {
				this.emit('error', e)
			}
		} // TODO - log the unknown command?

		if (buffer.length > length) {
			this._parseCommand(buffer.slice(length))
		}
	}
}
