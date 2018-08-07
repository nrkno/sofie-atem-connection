import { ChildProcess, fork } from 'child_process'
import { EventEmitter } from 'events'
import * as path from 'path'
import { CommandParser } from './atemCommandParser'
import AbstractCommand from '../commands/AbstractCommand'

export class AtemSocket extends EventEmitter {
	private _debug = false
	private _localPacketId = 1
	private _address: string
	private _port: number = 9910
	private _socketProcess: ChildProcess
	private _commandParser: CommandParser = new CommandParser()

	constructor (options: { address?: string, port?: number, debug?: boolean, log?: (args1: any, args2?: any, args3?: any) => void }) {
		super()
		this._address = options.address || this._address
		this._port = options.port || this._port
		this._debug = options.debug || false
		this.log = options.log || this.log

		this._createSocketProcess()
	}

	public connect (address?: string, port?: number) {
		if (address) {
			this._address = address
		}
		if (port) {
			this._port = port
		}

		return this._socketProcess.send({
			cmd: 'connect',
			payload: {
				address,
				port
			}
		})
	}

	public disconnect () {
		return new Promise((resolve, reject) => {
			// @ts-ignore
			this._socketProcess.send({
				cmd: 'disconnect'
			}, (error: Error) => {
				if (error) {
					reject(error)
				} else {
					resolve()
				}
			})
		})
	}

	public log (..._args: any[]): void {
		// Will be re-assigned by the top-level ATEM class.
	}

	get nextPacketId (): number {
		return this._localPacketId
	}

	public _sendCommand (command: AbstractCommand) {
		if (typeof command.serialize !== 'function') {
			return
		}

		const payload = command.serialize()
		if (this._debug) this.log('PAYLOAD', payload)
		return this._socketProcess.send({
			cmd: 'sendCommand',
			payload
		})
	}

	private _createSocketProcess () {
		this._socketProcess = fork(path.resolve('dist/lib/atemSocketChild.js'), [], {silent: true})
		this._socketProcess.on('message', this._receiveMessage.bind(this))
	}

	private _receiveMessage (message: any) {
		if (typeof message !== 'object') {
			return
		}

		if (typeof message.cmd !== 'string' || message.cmd.length <= 0) {
			return
		}

		const payload = message.payload
		switch (message.cmd) {
			case 'log':
				this.log(message.payload)
				break
			case 'commandPacket':
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
