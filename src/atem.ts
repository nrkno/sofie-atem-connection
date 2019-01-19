import { EventEmitter } from 'events'
import { AtemState } from './state'
import { AtemSocket } from './lib/atemSocket'
import { IPCMessageType, MacroAction } from './enums'
import AbstractCommand from './commands/AbstractCommand'
import * as Commands from './commands'
import * as DataTransferCommands from './commands/DataTransfer'
import { MediaPlayer } from './state/media'
import { MultiViewerSourceState } from './state/settings'
import {
	DipTransitionSettings,
	DVETransitionSettings,
	MixTransitionSettings,
	StingerTransitionSettings,
	SuperSourceBox,
	TransitionProperties,
	WipeTransitionSettings,
	SuperSourceProperties
} from './state/video'
import * as USK from './state/video/upstreamKeyers'
import { InputChannel } from './state/input'
import { DownstreamKeyerGeneral, DownstreamKeyerMask } from './state/video/downstreamKeyers'
import * as DT from './dataTransfer'
import { Util } from './lib/atemUtil'
import * as Enums from './enums'

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
	private dataTransferManager: DT.DataTransferManager
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
		this.dataTransferManager = new DT.DataTransferManager(
			(command: AbstractCommand) => this.sendCommand(command)
		)
		this.socket.on('receivedStateChange', (command: AbstractCommand) => this._mutateState(command))
		this.socket.on(IPCMessageType.CommandAcknowledged, ({trackingId}: {trackingId: number}) => this._resolveCommand(trackingId))
		this.socket.on(IPCMessageType.CommandTimeout, ({trackingId}: {trackingId: number}) => this._rejectCommand(trackingId))
		this.socket.on('error', (e) => this.emit('error', e))
		this.socket.on('connect', () => this.emit('connected'))
		this.socket.on('disconnect', () => this.emit('disconnected'))
	}

	connect (address: string, port?: number) {
		return this.socket.connect(address, port)
	}

	disconnect (): Promise<void> {
		return new Promise((resolve, reject) => {
			this.socket.disconnect().then(() => resolve()).catch(reject)
		})
	}

	sendCommand (command: AbstractCommand): Promise<any> {
		const nextPacketId = this.socket.nextPacketId
		this._sentQueue[nextPacketId] = command
		return new Promise((resolve, reject) => {
			command.resolve = resolve
			command.reject = reject
			this.socket._sendCommand(command, nextPacketId).catch(reject)
		})
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
		command.downstreamKeyerId = key
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
		command.downstreamKeyerId = key
		command.updateProps({tie})
		return this.sendCommand(command)
	}

	setDownstreamKeyOnAir (onAir: boolean, key = 0) {
		const command = new Commands.DownstreamKeyOnAirCommand()
		command.downstreamKeyerId = key
		command.updateProps({onAir})
		return this.sendCommand(command)
	}

	setDownstreamKeyCutSource (input: number, key = 0) {
		const command = new Commands.DownstreamKeyCutSourceCommand()
		command.downstreamKeyerId = key
		command.updateProps({ input })
		return this.sendCommand(command)
	}

	setDownstreamKeyFillSource (input: number, key = 0) {
		const command = new Commands.DownstreamKeyFillSourceCommand()
		command.downstreamKeyerId = key
		command.updateProps({ input })
		return this.sendCommand(command)
	}

	setDownstreamKeyGeneralProperties (props: Partial<DownstreamKeyerGeneral>, key = 0) {
		const command = new Commands.DownstreamKeyGeneralCommand()
		command.downstreamKeyerId = key
		command.updateProps(props)
		return this.sendCommand(command)
	}

	setDownstreamKeyMaskSettings (props: Partial<DownstreamKeyerMask>, key = 0) {
		const command = new Commands.DownstreamKeyMaskCommand()
		command.downstreamKeyerId = key
		command.updateProps(props)
		return this.sendCommand(command)
	}

	setDownstreamKeyRate (rate: number, key = 0) {
		const command = new Commands.DownstreamKeyRateCommand()
		command.downstreamKeyerId = key
		command.updateProps({ rate })
		return this.sendCommand(command)
	}

	macroContinue () {
		const command = new Commands.MacroActionCommand()
		command.index = 0
		command.updateProps({action: MacroAction.Continue})
		return this.sendCommand(command)
	}

	macroDelete (index = 0) {
		const command = new Commands.MacroActionCommand()
		command.index = index
		command.updateProps({action: MacroAction.Delete})
		return this.sendCommand(command)
	}

	macroInsertUserWait () {
		const command = new Commands.MacroActionCommand()
		command.index = 0
		command.updateProps({action: MacroAction.InsertUserWait})
		return this.sendCommand(command)
	}

	macroRun (index = 0) {
		const command = new Commands.MacroActionCommand()
		command.index = index
		command.updateProps({action: MacroAction.Run})
		return this.sendCommand(command)
	}

	macroStop () {
		const command = new Commands.MacroActionCommand()
		command.index = 0
		command.updateProps({action: MacroAction.Stop})
		return this.sendCommand(command)
	}

	macroStopRecord () {
		const command = new Commands.MacroActionCommand()
		command.index = 0
		command.updateProps({action: MacroAction.StopRecord})
		return this.sendCommand(command)
	}

	setMultiViewerSource (newProps: Partial<MultiViewerSourceState>, mv = 0) {
		const command = new Commands.MultiViewerSourceCommand()
		command.multiViewerId = mv
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setMediaPlayerSettings (newProps: Partial<MediaPlayer>, player = 0) {
		const command = new Commands.MediaPlayerStatusCommand()
		command.mediaPlayerId = player
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setMediaPlayerSource (newProps: Partial<{ sourceType: Enums.MediaSourceType, stillIndex: number, clipIndex: number }>, player = 0) {
		const command = new Commands.MediaPlayerSourceCommand()
		command.mediaPlayerId = player
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setMediaClip (index: number, name: string, frames = 1) {
		const command = new Commands.MediaPoolSetClipCommand()
		command.updateProps({ index, name, frames })
		return this.sendCommand(command)
	}

	clearMediaPoolClip (clipId: number) {
		const command = new Commands.MediaPoolClearClipCommand()
		command.updateProps({ index: clipId })
		return this.sendCommand(command)
	}

	clearMediaPoolStill (stillId: number) {
		const command = new Commands.MediaPoolClearStillCommand()
		command.updateProps({ index: stillId })
		return this.sendCommand(command)
	}

	setSuperSourceBoxSettings (newProps: Partial<SuperSourceBox>, box = 0) {
		const command = new Commands.SuperSourceBoxParametersCommand()
		command.boxId = box
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setSuperSourceProperties (newProps: Partial<SuperSourceProperties>) {
		const command = new Commands.SuperSourcePropertiesCommand()
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

	uploadStill (index: number, data: Buffer, name: string, description: string) {
		const resolution = Util.getResolution(this.state.settings.videoMode)
		return this.dataTransferManager.uploadStill(
			index,
			Util.convertRGBAToYUV422(resolution[0], resolution[1], data),
			name,
			description
		)
	}

	uploadClip (index: number, frames: Array<Buffer>, name: string) {
		const resolution = Util.getResolution(this.state.settings.videoMode)
		const data: Array<Buffer> = []
		for (const frame of frames) {
			data.push(Util.convertRGBAToYUV422(resolution[0], resolution[1], frame))
		}
		return this.dataTransferManager.uploadClip(
			index,
			data,
			name
		)
	}

	uploadAudio (index: number, data: Buffer, name: string) {
		return this.dataTransferManager.uploadAudio(
			index,
			Util.convertWAVToRaw(data),
			name
		)
	}

	private _mutateState (command: AbstractCommand) {
		if (typeof command.applyToState === 'function') {
			command.applyToState(this.state)
			this.emit('stateChanged', this.state, command)
		}
		for (const commandName in DataTransferCommands) {
			if (command.constructor.name === commandName) {
				this.dataTransferManager.handleCommand(command)
			}
		}
	}

	private _resolveCommand (trackingId: number) {
		if (this._sentQueue[trackingId]) {
			this._sentQueue[trackingId].resolve(this._sentQueue[trackingId])
			delete this._sentQueue[trackingId]
		}
	}

	private _rejectCommand (trackingId: number) {
		if (this._sentQueue[trackingId]) {
			this._sentQueue[trackingId].reject(this._sentQueue[trackingId])
			delete this._sentQueue[trackingId]
		}
	}
}
