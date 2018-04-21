import { EventEmitter } from 'events'
import { AtemState } from './lib/atemState'
import { AtemSocket } from './lib/atemSocket'
import AbstractCommand from './commands/AbstractCommand'
import * as Commands from './commands'

export enum Model {
	TVS = 0x01,
	OneME = 0x02,
	TwoME = 0x03,
	PS4K = 0x04,
	OneME4K = 0x05,
	TwoME4K = 0x06,
	TwoMEBS4K = 0x07,
	TVSHD = 0x08
}

export enum TransitionStyle {
	MIX = 0x00,
	DIP = 0x01,
	WIPE = 0x02,
	DVE = 0x03,
	STING = 0x04
}

export enum TallyState {
	None = 0x00,
	Program = 0x01,
	Preview = 0x02
}

export interface AtemOptions {
	localPort?: number,
	debug?: boolean,
	externalLog?: (arg0?: any,arg1?: any,arg2?: any,arg3?: any) => void
}

export class Atem extends EventEmitter {
	DEFAULT_PORT = 9910
	RECONNECT_INTERVAL = 5000
	DEBUG = false

	AUDIO_GAIN_RATE = 65381

	event: EventEmitter
	state: AtemState
	private socket: AtemSocket
	private _log: (arg0?: any,arg1?: any,arg2?: any,arg3?: any) => void
	private _sentQueue: {[packetId: string]: AbstractCommand } = {}

	constructor (options?: AtemOptions) {
		super()
		if (options) {
			this.DEBUG = options.debug === undefined ? false : options.debug
			this._log = options.externalLog || function () { return }
		}

		this.state = new AtemState()
		this.socket = new AtemSocket()
		this.socket.on('receivedStateChange', (command: AbstractCommand) => this._mutateState(command))
		this.socket.on('commandAcknowleged', (packetId: number) => this._resolveCommand(packetId))
	}

	connect (address: string, port?: number) {
		this.socket.connect(address, port)
	}

	sendCommand (command: AbstractCommand): Promise<any> {
		let nextPacketId = this.socket.nextPacketId
		let promise = new Promise((resolve, reject) => {
			command.resolve = resolve
			command.reject = reject
		})
		this._sentQueue[nextPacketId] = command
		this.socket._sendCommand(command)
		return promise
	}

	changeProgramInput (input: number, me = 0) {
		let command = new Commands.ProgramInputCommand()
		command.mixEffect = me
		command.source = input
		return this.sendCommand(command)
	}

	changePreviewInput (input: number, me = 0) {
		let command = new Commands.PreviewInputCommand()
		command.mixEffect = me
		command.source = input
		return this.sendCommand(command)
	}

	cut (me = 0) {
		let command = new Commands.CutCommand()
		command.mixEffect = me
		return this.sendCommand(command)
	}

	autoTransition (me = 0) {
		let command = new Commands.AutoTransitionCommand()
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setDipTransitionSettings (flag: Commands.MaskFlags, rate: number, input: number, me = 0) {
		let command = new Commands.TransitionDipCommand()
		command.flag = flag
		command.rate = rate
		command.input = input
		command.mixEffect = me
		return this.sendCommand(command)
	}

	private _mutateState (command: AbstractCommand) {
		command.applyToState(this.state)
		this.emit('stateChanged', this.state, command)
	}

	private _resolveCommand (packetId: number) {
		if (this._sentQueue[packetId]) {
			this._sentQueue[packetId].resolve(this._sentQueue[packetId])
			delete this._sentQueue[packetId]
		}
	}
}
