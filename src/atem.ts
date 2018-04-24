import { EventEmitter } from 'events'
import { AtemState, DVEEffect } from './lib/atemState'
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

	autoDownstreamKey (key = 0) {
		let command = new Commands.DownstreamKeyAutoCommand()
		command.downstreamKeyId = key
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

	setDVETransitionRate (rate: number, me = 1) {
		let command = new Commands.TransitionDVECommand()
		command.flags = 1 << 0
		command.mixEffect = me
		command.rate = rate
		return this.sendCommand(command)
	}
	setDVETransitionLogoRate (rate: number, me = 1) {
		let command = new Commands.TransitionDVECommand()
		command.flags = 1 << 1
		command.mixEffect = me
		command.logoRate = rate
		return this.sendCommand(command)
	}
	setDVETransitionStyle (style: DVEEffect, me = 1) {
		let command = new Commands.TransitionDVECommand()
		command.flags = 1 << 2
		command.mixEffect = me
		command.style = style
		return this.sendCommand(command)
	}
	setDVETransitionFillSource (source: number, me = 1) {
		let command = new Commands.TransitionDVECommand()
		command.flags = 1 << 3
		command.mixEffect = me
		command.fillSource = source
		return this.sendCommand(command)

	}
	setDVETransitionKeySource (source: number, me = 1) {
		let command = new Commands.TransitionDVECommand()
		command.flags = 1 << 4
		command.mixEffect = me
		command.keySource = source
		return this.sendCommand(command)

	}

	setDVETransitionEnableKey (enable: boolean, me = 1) {
		let command = new Commands.TransitionDVECommand()
		command.flags = 1 << 5
		command.mixEffect = me
		command.enableKey = enable
		return this.sendCommand(command)
	}
	setDVETransitionPreMultiplied (premultiplied: boolean, me = 1) {
		let command = new Commands.TransitionDVECommand()
		command.flags = 1 << 6
		command.mixEffect = me
		command.preMultiplied = premultiplied
		return this.sendCommand(command)
	}
	setDVETransitionClip (clip: number, me = 1) {
		let command = new Commands.TransitionDVECommand()
		command.flags = 1 << 7
		command.mixEffect = me
		command.clip = clip
		return this.sendCommand(command)
	}
	setDVETransitionGain (gain: number, me = 1) {
		let command = new Commands.TransitionDVECommand()
		command.flags = 1 << 8
		command.mixEffect = me
		command.gain = gain
		return this.sendCommand(command)
	}
	setDVETransitionInvertKey (invertKey: boolean, me = 1) {
		let command = new Commands.TransitionDVECommand()
		command.flags = 1 << 9
		command.mixEffect = me
		command.invertKey = invertKey
		return this.sendCommand(command)
	}
	setDVETransitionReverse (reverse: boolean, me = 1) {
		let command = new Commands.TransitionDVECommand()
		command.flags = 1 << 10
		command.mixEffect = me
		command.reverse = reverse
		return this.sendCommand(command)
	}
	setDVETransitionFlipFlop (flipFlop: boolean, me = 1) {
		let command = new Commands.TransitionDVECommand()
		command.flags = 1 << 11
		command.mixEffect = me
		command.flipFlop = flipFlop
		return this.sendCommand(command)
	}

	setMixTransitionRate (rate: number, me = 0) {
		let command = new Commands.TransitionMixCommand()
		command.rate = rate
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setTransitionPosition (position: number, me = 0) {
		let command = new Commands.TransitionPositionCommand()
		command.handlePosition = position
		command.mixEffect = me
		return this.sendCommand(command)
	}

	previewTransition (on: boolean, me = 0) {
		let command = new Commands.PreviewTransitionCommand()
		command.preview = on
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setTransitionStyle (style: TransitionStyle, me = 0) {
		let command = new Commands.TransitionPropertiesCommand()
		command.style = style
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setTransitionSelection (selection: number, me = 0) {
		let command = new Commands.TransitionPropertiesCommand()
		command.selection = selection
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setStingerTransitionSource (source: number, me = 0) {
		let command = new Commands.TransitionStingerCommand()
		command.flags = command.maskFlags.Source
		command.source = source
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setStingerTransitionPreMultipliedKey (premultiplied: boolean, me = 0) {
		let command = new Commands.TransitionStingerCommand()
		command.flags = command.maskFlags.PreMultipliedKey
		command.preMultipliedKey = premultiplied
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setStingerTransitionClip (clip: number, me = 0) {
		let command = new Commands.TransitionStingerCommand()
		command.flags = command.maskFlags.Clip
		command.clip = clip
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setStingerTransitionGain (gain: number, me = 0) {
		let command = new Commands.TransitionStingerCommand()
		command.flags = command.maskFlags.Gain
		command.gain = gain
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setStingerTransitionInvert (invert: boolean, me = 0) {
		let command = new Commands.TransitionStingerCommand()
		command.flags = command.maskFlags.Invert
		command.invert = invert
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setStingerTransitionPreroll (preroll: number, me = 0) {
		let command = new Commands.TransitionStingerCommand()
		command.flags = command.maskFlags.Preroll
		command.preroll = preroll
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setStingerTransitionClipDuration (duration: number, me = 0) {
		let command = new Commands.TransitionStingerCommand()
		command.flags = command.maskFlags.ClipDuration
		command.clipDuration = duration
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setStingerTransitionTriggerPoint (triggerPoint: number, me = 0) {
		let command = new Commands.TransitionStingerCommand()
		command.flags = command.maskFlags.TriggerPoint
		command.triggerPoint = triggerPoint
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setStingerTransitionMixRate (mixRate: number, me = 0) {
		let command = new Commands.TransitionStingerCommand()
		command.flags = command.maskFlags.MixRate
		command.mixRate = mixRate
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setWipeTransitionRate (rate: number, me = 0) {
		let command = new Commands.TransitionWipeCommand()
		command.flags = command.maskFlags.Rate
		command.rate = rate
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setWipeTransitionPattern (pattern: number, me = 0) {
		let command = new Commands.TransitionWipeCommand()
		command.flags = command.maskFlags.Pattern
		command.pattern = pattern
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setWipeTransitionBorderWidth (borderWidth: number, me = 0) {
		let command = new Commands.TransitionWipeCommand()
		command.flags = command.maskFlags.BorderWidth
		command.borderWidth = borderWidth
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setWipeTransitionBorderInput (borderInput: number, me = 0) {
		let command = new Commands.TransitionWipeCommand()
		command.flags = command.maskFlags.BorderInput
		command.borderInput = borderInput
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setWipeTransitionSymmetry (symmetry: number, me = 0) {
		let command = new Commands.TransitionWipeCommand()
		command.flags = command.maskFlags.Symmetry
		command.symmetry = symmetry
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setWipeTransitionBorderSoftness (borderSoftness: number, me = 0) {
		let command = new Commands.TransitionWipeCommand()
		command.flags = command.maskFlags.BorderSoftness
		command.borderSoftness = borderSoftness
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setWipeTransitionXPosition (xposition: number, me = 0) {
		let command = new Commands.TransitionWipeCommand()
		command.flags = command.maskFlags.XPosition
		command.xPosition = xposition
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setWipeTransitionYPosition (yposition: number, me = 0) {
		let command = new Commands.TransitionWipeCommand()
		command.flags = command.maskFlags.YPosition
		command.yPosition = yposition
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setWipeTransitionReverseDirection (reverseDirection: boolean, me = 0) {
		let command = new Commands.TransitionWipeCommand()
		command.flags = command.maskFlags.ReverseDirection
		command.reverseDirection = reverseDirection
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setWipeTransitionFlipFlop (flipFlop: boolean, me = 0) {
		let command = new Commands.TransitionWipeCommand()
		command.flags = command.maskFlags.FlipFlop
		command.flipFlop = flipFlop
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setAuxSource (source: number, bus = 0) {
		let command = new Commands.AuxSourceCommand()
		command.auxBus = bus
		command.source = source
		return this.sendCommand(command)
	}

	setDownstreamKeyTie (tie: boolean, key = 0) {
		let command = new Commands.DownstreamKeyTieCommand()
		command.downstreamKeyId = key
		command.tie = tie
		return this.sendCommand(command)
	}

	setDownstreamKeyOnAir (onAir: boolean, key = 0) {
		let command = new Commands.DownstreamKeyOnAirCommand()
		command.downstreamKeyId = key
		command.onair = onAir
		return this.sendCommand(command)
	}

	macroRun (index = 0) {
		let command = new Commands.MacroActionCommand()
		command.index = index
		command.action = command.MacroAction.Run
		return this.sendCommand(command)
	}

	mediaPlay (playing = true, player = 0) {
		let command = new Commands.MediaPlayerStatusCommand()
		command.mediaPlayerId = player
		command.flag = command.MaskFlags.Playing
		command.playing = playing
		return this.sendCommand(command)
	}

	mediaLoop (looping = true, player = 0) {
		let command = new Commands.MediaPlayerStatusCommand()
		command.mediaPlayerId = player
		command.flag = command.MaskFlags.Loop
		command.loop = looping
		return this.sendCommand(command)
	}

	mediaAtBeginning (atBeginning = true, player = 0) {
		let command = new Commands.MediaPlayerStatusCommand()
		command.mediaPlayerId = player
		command.flag = command.MaskFlags.Beginning
		command.atBeginning = atBeginning
		return this.sendCommand(command)
	}

	mediaClipFrame (frame: number, player = 0) {
		let command = new Commands.MediaPlayerStatusCommand()
		command.mediaPlayerId = player
		command.flag = command.MaskFlags.Frame
		command.clipFrame = frame
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
