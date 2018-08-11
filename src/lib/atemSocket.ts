import { ChildProcess, fork } from 'child_process'
import { EventEmitter } from 'events'
import * as path from 'path'
import { CommandParser } from './atemCommandParser'
import AbstractCommand from '../commands/AbstractCommand'
import { IPCMessageType } from '../enums'
import exitHook = require('exit-hook')
import { Util } from './atemUtil'

export class AtemSocket extends EventEmitter {
	private _debug = false
	private _localPacketId = 0
	private _address: string
	private _port: number = 9910
	private _shouldConnect = false
	private _socketProcess: ChildProcess | null
	private _commandParser: CommandParser = new CommandParser()

	constructor (options: { address?: string, port?: number, debug?: boolean, log?: (args1: any, args2?: any, args3?: any) => void }) {
		super()
		this._address = options.address || this._address
		this._port = options.port || this._port
		this._debug = options.debug || false
		this.log = options.log || this.log

		this._createSocketProcess()

		// When the parent process begins exiting, remove the listeners on our child process.
		// We do this to avoid throwing an error when the child process exits
		// as a natural part of the parent process exiting.
		exitHook(() => {
			if (this._socketProcess) {
				this._socketProcess.removeAllListeners()
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

	get nextPacketId (): number {
		return ++this._localPacketId
	}

	public _sendCommand (command: AbstractCommand, trackingId: number) {
		if (typeof command.serialize !== 'function') {
			// TODO: should this reject instead of resolve?
			return Promise.resolve()
		}

		const payload = command.serialize()
		if (this._debug) this.log('PAYLOAD', payload)

		return this._sendSubprocessMessage({
			cmd: IPCMessageType.OutboundCommand,
			payload: {
				data: payload,
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

		this._socketProcess = fork(path.resolve(__dirname, 'atemSocketChild.js'), [], {silent: true})
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

		return Util.sendIPCMessage(this, '_socketProcess', message)
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
				this.emit(IPCMessageType.CommandAcknowledged, message.payload)
				break
			case IPCMessageType.InboundCommand:
				this._parseCommand(Buffer.from(payload.packet.data), payload.remotePacketId)
				break
		}
	}

	private _parseCommand (buffer: Buffer, packetId?: number) {
		const length = buffer.readUInt16BE(0)
		const name = buffer.toString('ascii', 4, 8)

		if (name === 'InCm') {
			this.emit('connect')
		}

		// this.log('COMMAND', `${name}(${length})`, buffer.slice(0, length))
		const cmd = this._commandParser.commandFromRawName(name)
		if (cmd && typeof cmd.deserialize === 'function') {
			try {
				cmd.deserialize(buffer.slice(0, length).slice(8))
				cmd.packetId = packetId || -1
				this.emit('receivedStateChange', cmd)
			} catch (e) {
				this.emit('error', e)
			}
		}

		if (buffer.length > length) {
			this._parseCommand(buffer.slice(length), packetId)
		}
	}
}
