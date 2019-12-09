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
		((event: 'error', listener: (message: string) => void) => this) &
		((event: 'commandsReceived', listener: (cmds: IDeserializedCommand[]) => void) => this) &
		((event: 'commandsAck', listener: (trackingIds: number[]) => void) => this)

	public emit!: ((event: 'disconnect') => boolean) &
		((event: 'error', message: string) => boolean) &
		((event: 'commandsReceived', cmds: IDeserializedCommand[]) => boolean) &
		((event: 'commandsAck', trackingIds: number[]) => boolean)

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

	public async sendCommands (commands: Array<{ rawCommand: ISerializableCommand, trackingId: number}>): Promise<void> {
		if (this._socketProcess) {
			const commands2 = commands.map(cmd => {
				if (typeof (cmd.rawCommand as any).serialize !== 'function') {
					throw new Error(`Command ${cmd.rawCommand.constructor.name} is not serializable`)
				}

				const payload = cmd.rawCommand.serialize(this._commandParser.version)
				if (this._debug) this.log('PAYLOAD', cmd.rawCommand.constructor.name, payload)

				return {
					payload: [...payload],
					rawName: (cmd.rawCommand.constructor as any).rawName,
					trackingId: cmd.trackingId
				}
			})

			await this._socketProcess.sendCommands(commands2)
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
			async (payload: Buffer) => this._parseCommands(Buffer.from(payload)), // onCommandsReceived
			async (ids: Array<{ packetId: number, trackingId: number }>) => { this.emit('commandsAck', ids.map(id => id.trackingId)) } // onCommandsAcknowledged
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

	private _parseCommands (buffer: Buffer) {
		const parsedCommands: IDeserializedCommand[] = []

		while (buffer.length > 8) {
			const length = buffer.readUInt16BE(0)
			const name = buffer.toString('ascii', 4, 8)

			if (length < 8) {
				// Commands are never less than 8, as that is the header
				break
			}

			const cmdConstructor = this._commandParser.commandFromRawName(name)
			if (cmdConstructor && typeof cmdConstructor.deserialize === 'function') {
				try {
					const cmd: IDeserializedCommand = cmdConstructor.deserialize(buffer.slice(0, length).slice(8), this._commandParser.version)

					if (cmdConstructor.name === VersionCommand.name) { // init started
						const verCmd = cmd as VersionCommand
						this._commandParser.version = verCmd.properties.version
					}

					parsedCommands.push(cmd)
				} catch (e) {
					this.emit('error', `Failed to deserialize command: ${cmdConstructor.constructor.name}: ${e}`)
				}
			} // TODO - log the unknown command?

			// Trim the buffer
			buffer = buffer.slice(length)
		}

		if (parsedCommands.length > 0) {
			this.emit('commandsReceived', parsedCommands)
		}
	}
}
