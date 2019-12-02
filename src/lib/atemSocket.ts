import { ChildProcess, fork } from 'child_process'
import { EventEmitter } from 'events'
import * as path from 'path'
import { CommandParser } from './atemCommandParser'
import { IPCMessageType } from '../enums'
import exitHook = require('exit-hook')
import { Util } from './atemUtil'
import { VersionCommand, ISerializableCommand, IDeserializedCommand } from '../commands'
import { DEFAULT_PORT } from '../atem'

export class AtemSocket extends EventEmitter {
	private _debug = false
	private _nextCommandTrackingId = 0
	private _address: string
	private _port: number = DEFAULT_PORT
	private _shouldConnect = false
	private _socketProcess: ChildProcess | null
	private _commandParser: CommandParser = new CommandParser()

	constructor (options: { address?: string, port?: number, debug?: boolean, log?: (...args: any[]) => void }) {
		super()
		this._address = options.address || ''
		this._port = options.port || this._port
		this._debug = options.debug || false
		this.log = options.log || this.log

		this._socketProcess = null
		this._createSocketProcess()

		// When the parent process begins exiting, remove the listeners on our child process.
		// We do this to avoid throwing an error when the child process exits
		// as a natural part of the parent process exiting.
		exitHook(() => {
			if (this._socketProcess) {
				this._socketProcess.removeAllListeners()
				this._socketProcess.kill()
			}
		})
	}

	public connect (address?: string, port?: number) {
		this._shouldConnect = true

		if (address) {
			this._address = address
		}
		if (port) {
			this._port = port
		}

		return this._sendSubprocessMessage({
			cmd: IPCMessageType.Connect,
			payload: {
				address: this._address,
				port: this._port
			}
		})
	}

	public disconnect () {
		this._shouldConnect = false

		return this._sendSubprocessMessage({
			cmd: IPCMessageType.Disconnect
		})
	}

	public log (..._args: any[]): void {
		// Will be re-assigned by the top-level ATEM class.
	}

	get nextCommandTrackingId (): number {
		if (this._nextCommandTrackingId >= Number.MAX_SAFE_INTEGER) {
			this._nextCommandTrackingId = 0
		}
		return ++this._nextCommandTrackingId
	}

	public _sendCommand (command: ISerializableCommand, trackingId: number) {
		if (typeof (command as any).serialize !== 'function') {
			return Promise.reject(new Error('Command is not serializable'))
		}

		const payload = command.serialize(this._commandParser.version)
		const fullPayload = Buffer.alloc(payload.length + 8, 0)
		fullPayload.writeUInt16BE(fullPayload.length, 0)
		fullPayload.write((command.constructor as any).rawName, 4, 4)
		payload.copy(fullPayload, 8, 0)

		if (this._debug) this.log('PAYLOAD', command.constructor.name, fullPayload)

		return this._sendSubprocessMessage({
			cmd: IPCMessageType.OutboundCommand,
			payload: {
				data: fullPayload,
				trackingId
			}
		})
	}

	private _createSocketProcess () {
		if (this._socketProcess) {
			this._socketProcess.removeAllListeners()
			this._socketProcess.kill()
			this._socketProcess = null
		}

		this._socketProcess = fork(path.resolve(__dirname, '../../dist/socket-child.js'), [], {
			silent: !this._debug,
			stdio: this._debug ? [0, 1, 2, 'ipc'] : undefined
		})
		this._socketProcess.on('stdout', out => console.log(out))
		this._socketProcess.on('message', this._receiveSubprocessMessage.bind(this))
		this._socketProcess.on('error', error => {
			this.emit('error', error)
			this.log('socket process error:', error)
		})
		this._socketProcess.on('exit', (code, signal) => {
			process.nextTick(() => {
				this.emit('error', new Error(`The socket process unexpectedly closed (code: "${code}", signal: "${signal}")`))
				this.log('socket process exit:', code, signal)
				this._createSocketProcess()
			})
		})

		if (this._shouldConnect) {
			this.connect().catch(error => {
				const errorMsg = 'Failed to reconnect after respawning socket process'
				this.emit('error', error)
				this.log(errorMsg + ':', error && error.message)
			})
		}
	}

	private async _sendSubprocessMessage (message: {cmd: IPCMessageType; payload?: any, _messageId?: number}) {
		if (!this._socketProcess) {
			throw new Error('Socket process process does not exist')
		}

		return Util.sendIPCMessage(this, '_socketProcess', message, this.log)
	}

	private _receiveSubprocessMessage (message: any) {
		if (typeof message !== 'object') {
			return
		}

		if (typeof message.cmd !== 'string' || message.cmd.length <= 0) {
			return
		}

		const payload = message.payload
		switch (message.cmd) {
			case IPCMessageType.Log:
				this.log(message.payload)
				break
			case IPCMessageType.CommandAcknowledged:
				this.emit(IPCMessageType.CommandAcknowledged, message.payload.trackingId)
				break
			case IPCMessageType.InboundCommand:
				this._parseCommand(Buffer.from(payload.packet.data))
				break
			case IPCMessageType.Disconnect:
				this.emit(IPCMessageType.Disconnect)
				break
		}
	}

	private _parseCommand (buffer: Buffer) {
		const length = buffer.readUInt16BE(0)
		const name = buffer.toString('ascii', 4, 8)

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

				this.emit('receivedStateChange', cmd)
			} catch (e) {
				this.emit('error', e)
			}
		}

		if (buffer.length > length) {
			this._parseCommand(buffer.slice(length))
		}
	}
}
