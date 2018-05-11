import { EventEmitter } from 'events'
import { AtemState } from './state'
import { AtemSocket } from './lib/atemSocket'
import { MacroAction } from './enums'
import AbstractCommand from './commands/AbstractCommand'
import * as Commands from './commands'
import { MediaPlayer } from './state/media'
import {
	DipTransitionSettings,
	DVETransitionSettings,
	MixTransitionSettings,
	StingerTransitionSettings,
	SuperSourceBox,
	TransitionProperties,
	WipeTransitionSettings
} from './state/video'
import * as USK from './state/video/upstreamKeyers'
import { InputChannel } from './state/input'

export interface AtemOptions {
	address?: string,
	port?: number,
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
	private _log: (...args: any[]) => void
	private _sentQueue: {[packetId: string]: AbstractCommand } = {}

	constructor (options?: AtemOptions) {
		super()
		if (options) {
			this.DEBUG = options.debug === undefined ? false : options.debug
			this._log = options.externalLog || function (...args: any[]): void {
				console.log(...args)
			}
		}

		this.state = new AtemState()
		this.socket = new AtemSocket({
			debug: this.DEBUG,
			log: this._log,
			address: (options || {}).address,
			port: (options || {}).port
		})
		this.socket.on('receivedStateChange', (command: AbstractCommand) => this._mutateState(command))
		this.socket.on('commandAcknowleged', (packetId: number) => this._resolveCommand(packetId))
		this.socket.on('connect', () => this.emit('connected'))
		this.socket.on('disconnect', () => this.emit('disconnected'))
	}

	connect (address: string, port?: number) {
		this.socket.connect(address, port)
	}

	sendCommand (command: AbstractCommand): Promise<any> {
		const nextPacketId = this.socket.nextPacketId
		const promise = new Promise((resolve, reject) => {
			command.resolve = resolve
			command.reject = reject
		})
		this._sentQueue[nextPacketId] = command
		this.socket._sendCommand(command)
		return promise
	}

	changeProgramInput (input: number, me = 0) {
		const command = new Commands.ProgramInputCommand()
		command.mixEffect = me
		command.updateProps({source: input})
		return this.sendCommand(command)
	}

	changePreviewInput (input: number, me = 0) {
		const command = new Commands.PreviewInputCommand()
		command.mixEffect = me
		command.updateProps({source: input})
		return this.sendCommand(command)
	}

	cut (me = 0) {
		const command = new Commands.CutCommand()
		command.mixEffect = me
		return this.sendCommand(command)
	}

	autoTransition (me = 0) {
		const command = new Commands.AutoTransitionCommand()
		command.mixEffect = me
		return this.sendCommand(command)
	}

	autoDownstreamKey (key = 0) {
		const command = new Commands.DownstreamKeyAutoCommand()
		command.downstreamKeyId = key
		return this.sendCommand(command)
	}

	setDipTransitionSettings (newProps: Partial<DipTransitionSettings>, me = 0) {
		const command = new Commands.TransitionDipCommand()
		command.mixEffect = me
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setDVETransitionSettings (newProps: Partial<DVETransitionSettings>, me = 1) {
		const command = new Commands.TransitionDVECommand()
		command.mixEffect = me
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setMixTransitionSettings (newProps: Partial<MixTransitionSettings>, me = 0) {
		const command = new Commands.TransitionMixCommand()
		command.mixEffect = me
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setTransitionPosition (position: number, me = 0) {
		const command = new Commands.TransitionPositionCommand()
		command.mixEffect = me
		command.updateProps({handlePosition: position})
		return this.sendCommand(command)
	}

	previewTransition (on: boolean, me = 0) {
		const command = new Commands.PreviewTransitionCommand()
		command.mixEffect = me
		command.updateProps({preview: on})
		return this.sendCommand(command)
	}

	setTransitionStyle (newProps: Partial<TransitionProperties>, me = 0) {
		const command = new Commands.TransitionPropertiesCommand()
		command.mixEffect = me
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setStingerTransitionSettings (newProps: Partial<StingerTransitionSettings>, me = 0) {
		const command = new Commands.TransitionStingerCommand()
		command.mixEffect = me
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setWipeTransitionSettings (newProps: Partial<WipeTransitionSettings>, me = 0) {
		const command = new Commands.TransitionWipeCommand()
		command.mixEffect = me
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setAuxSource (source: number, bus = 0) {
		const command = new Commands.AuxSourceCommand()
		command.auxBus = bus
		command.updateProps({source})
		return this.sendCommand(command)
	}

	setDownstreamKeyTie (tie: boolean, key = 0) {
		const command = new Commands.DownstreamKeyTieCommand()
		command.downstreamKeyId = key
		command.updateProps({tie})
		return this.sendCommand(command)
	}

	setDownstreamKeyOnAir (onAir: boolean, key = 0) {
		const command = new Commands.DownstreamKeyOnAirCommand()
		command.downstreamKeyId = key
		command.updateProps({onAir})
		return this.sendCommand(command)
	}

	macroRun (index = 0) {
		const command = new Commands.MacroActionCommand()
		command.index = index
		command.updateProps({action: MacroAction.Run})
		return this.sendCommand(command)
	}

	setMediaPlayerSettings (newProps: Partial<MediaPlayer>, player = 0) {
		const command = new Commands.MediaPlayerStatusCommand()
		command.mediaPlayerId = player
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setSuperSourceBoxSettings (newProps: Partial<SuperSourceBox>, box = 0) {
		const command = new Commands.SuperSourceBoxParametersCommand()
		command.boxId = box
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setInputSettings (newProps: Partial<InputChannel>, input = 0) {
		const command = new Commands.InputPropertiesCommand()
		command.inputId = input
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setUpstreamKeyerChromaSettings (newProps: Partial<USK.UpstreamKeyerChromaSettings>, me = 0, keyer = 0) {
		const command = new Commands.MixEffectKeyChromaCommand()
		command.mixEffect = me
		command.upstreamKeyerId = keyer
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setUpstreamKeyerCutSource (cutSource: number, me = 0, keyer = 0) {
		const command = new Commands.MixEffectKeyCutSourceSetCommand()
		command.mixEffect = me
		command.upstreamKeyerId = keyer
		command.updateProps({cutSource})
		return this.sendCommand(command)
	}

	setUpstreamKeyerFillSource (fillSource: number, me = 0, keyer = 0) {
		const command = new Commands.MixEffectKeyFillSourceSetCommand()
		command.mixEffect = me
		command.upstreamKeyerId = keyer
		command.updateProps({fillSource})
		return this.sendCommand(command)
	}

	setUpstreamKeyerDVESettings (newProps: Partial<USK.UpstreamKeyerDVESettings>, me = 0, keyer = 0) {
		const command = new Commands.MixEffectKeyDVECommand()
		command.mixEffect = me
		command.upstreamKeyerId = keyer
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setUpstreamKeyerLumaSettings (newProps: Partial<USK.UpstreamKeyerLumaSettings>, me = 0, keyer = 0) {
		const command = new Commands.MixEffectKeyLumaCommand()
		command.mixEffect = me
		command.upstreamKeyerId = keyer
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setUpstreamKeyerMaskSettings (newProps: Partial<USK.UpstreamKeyerMaskSettings>, me = 0, keyer = 0) {
		const command = new Commands.MixEffectKeyMaskSetCommand()
		command.mixEffect = me
		command.upstreamKeyerId = keyer
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setUpstreamKeyerPatternSettings (newProps: Partial<USK.UpstreamKeyerPatternSettings>, me = 0, keyer = 0) {
		const command = new Commands.MixEffectKeyPatternCommand()
		command.mixEffect = me
		command.upstreamKeyerId = keyer
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setUpstreamKeyerOnAir (onAir: boolean, me = 0, keyer = 0) {
		const command = new Commands.MixEffectKeyOnAirCommand()
		command.mixEffect = me
		command.upstreamKeyerId = keyer
		command.updateProps({onAir})
		return this.sendCommand(command)
	}

	setUpstreamKeyerType (newProps: Partial<USK.UpstreamKeyerTypeSettings>, me = 0, keyer = 0) {
		const command = new Commands.MixEffectKeyTypeSetCommand()
		command.mixEffect = me
		command.upstreamKeyerId = keyer
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	private _mutateState (command: AbstractCommand) {
		if (typeof command.applyToState === 'function') {
			command.applyToState(this.state)
			this.emit('stateChanged', this.state, command)
		}
	}

	private _resolveCommand (packetId: number) {
		if (this._sentQueue[packetId]) {
			this._sentQueue[packetId].resolve(this._sentQueue[packetId])
			delete this._sentQueue[packetId]
		}
	}
}
