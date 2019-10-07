import { EventEmitter } from 'events'
import { AtemState } from './state'
import { AtemSocket } from './lib/atemSocket'
import { ISerializableCommand, IDeserializedCommand } from './commands/CommandBase'
import * as Commands from './commands'
import * as DataTransferCommands from './commands/DataTransfer'
import { MediaPlayer, MediaPlayerSource } from './state/media'
import { MultiViewerSourceState } from './state/settings'
import {
	DipTransitionSettings,
	DVETransitionSettings,
	MixTransitionSettings,
	StingerTransitionSettings,
	SuperSourceBox,
	TransitionProperties,
	WipeTransitionSettings,
	SuperSourceProperties,
	SuperSourceBorder
} from './state/video'
import * as USK from './state/video/upstreamKeyers'
import { InputChannel } from './state/input'
import { DownstreamKeyerGeneral, DownstreamKeyerMask } from './state/video/downstreamKeyers'
import * as DT from './dataTransfer'
import { Util } from './lib/atemUtil'
import * as Enums from './enums'
import { AudioChannel, AudioMasterChannel } from './state/audio'
import exitHook = require('exit-hook')
import { isArray, isFunction } from 'util'

export interface AtemOptions {
	address?: string,
	port?: number,
	debug?: boolean,
	externalLog?: (arg0?: any,arg1?: any,arg2?: any,arg3?: any) => void
}

interface SentCommand {
	command: ISerializableCommand
	resolve: (cmd: ISerializableCommand) => void
	reject: (cmd: ISerializableCommand) => void
}

export class Atem extends EventEmitter {
	DEFAULT_PORT = 9910
	RECONNECT_INTERVAL = 5000
	DEBUG = false

	AUDIO_GAIN_RATE = 65381

	private _state: AtemState
	private socket: AtemSocket
	private dataTransferManager: DT.DataTransferManager
	private _log: (...args: any[]) => void
	private _sentQueue: {[packetId: string]: SentCommand } = {}

	on!: ((event: 'error', listener: (message: any) => void) => this) & ((event: 'connected', listener: () => void) => this) & ((event: 'disconnected', listener: () => void) => this) & ((event: 'stateChanged', listener: (state: AtemState, path: string) => void) => this)

	constructor (options?: AtemOptions) {
		super()
		if (options) {
			this.DEBUG = options.debug === undefined ? false : options.debug
		}
		this._log = (options && options.externalLog) || function (...args: any[]): void {
			console.log(...args)
		}

		this._state = new AtemState()
		this.socket = new AtemSocket({
			debug: this.DEBUG,
			log: this._log,
			address: (options || {}).address,
			port: (options || {}).port
		})
		this.dataTransferManager = new DT.DataTransferManager(
			(command: ISerializableCommand) => this.sendCommand(command)
		)

		// When the parent process begins exiting, remove the listeners on our child process.
		// We do this to avoid throwing an error when the child process exits
		// as a natural part of the parent process exiting.
		exitHook(() => {
			if (this.dataTransferManager) {
				this.dataTransferManager.stop()
			}
		})

		this.socket.on('receivedStateChange', (command: IDeserializedCommand) => this._mutateState(command))
		this.socket.on(Enums.IPCMessageType.CommandAcknowledged, ({ trackingId }: {trackingId: number}) => this._resolveCommand(trackingId))
		this.socket.on(Enums.IPCMessageType.CommandTimeout, ({ trackingId }: {trackingId: number}) => this._rejectCommand(trackingId))
		this.socket.on('error', (e) => this.emit('error', e))
		this.socket.on('connect', () => this.emit('connected'))
		this.socket.on('disconnect', () => this.emit('disconnected'))
	}

	get state (): Readonly<AtemState> {
		return this._state
	}

	connect (address: string, port?: number) {
		return this.socket.connect(address, port)
	}

	disconnect (): Promise<void> {
		return new Promise((resolve, reject) => {
			this.socket.disconnect().then(() => resolve()).catch(reject)
		})
	}

	sendCommand (command: ISerializableCommand): Promise<ISerializableCommand> {
		const nextPacketId = this.socket.nextPacketId
		return new Promise((resolve, reject) => {
			this._sentQueue[nextPacketId] = {
				command,
				resolve,
				reject
			}
			this.socket._sendCommand(command, nextPacketId).catch(reject)
		})
	}

	changeProgramInput (input: number, me: number = 0) {
		const command = new Commands.ProgramInputCommand(me, input)
		return this.sendCommand(command)
	}

	changePreviewInput (input: number, me: number = 0) {
		const command = new Commands.PreviewInputCommand(me, input)
		return this.sendCommand(command)
	}

	cut (me: number = 0) {
		const command = new Commands.CutCommand(me)
		return this.sendCommand(command)
	}

	autoTransition (me: number = 0) {
		const command = new Commands.AutoTransitionCommand(me)
		return this.sendCommand(command)
	}

	fadeToBlack (me: number = 0) {
		const command = new Commands.FadeToBlackAutoCommand(me)
		return this.sendCommand(command)
	}

	autoDownstreamKey (key: number = 0, isTowardsOnAir?: boolean) {
		const command = new Commands.DownstreamKeyAutoCommand(key)
		command.updateProps({ isTowardsOnAir })
		return this.sendCommand(command)
	}

	setDipTransitionSettings (newProps: Partial<DipTransitionSettings>, me: number = 0) {
		const command = new Commands.TransitionDipCommand(me)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setDVETransitionSettings (newProps: Partial<DVETransitionSettings>, me: number = 0) {
		const command = new Commands.TransitionDVECommand(me)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setMixTransitionSettings (newProps: Partial<MixTransitionSettings>, me: number = 0) {
		const command = new Commands.TransitionMixCommand(me)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setTransitionPosition (position: number, me: number = 0) {
		const command = new Commands.TransitionPositionCommand(me, position)
		return this.sendCommand(command)
	}

	previewTransition (on: boolean, me: number = 0) {
		const command = new Commands.PreviewTransitionCommand(me, on)
		return this.sendCommand(command)
	}

	setTransitionStyle (newProps: Partial<TransitionProperties>, me: number = 0) {
		const command = new Commands.TransitionPropertiesCommand(me)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setStingerTransitionSettings (newProps: Partial<StingerTransitionSettings>, me: number = 0) {
		const command = new Commands.TransitionStingerCommand(me)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setWipeTransitionSettings (newProps: Partial<WipeTransitionSettings>, me: number = 0) {
		const command = new Commands.TransitionWipeCommand(me)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setAuxSource (source: number, bus: number = 0) {
		const command = new Commands.AuxSourceCommand(bus, source)
		return this.sendCommand(command)
	}

	setDownstreamKeyTie (tie: boolean, key: number = 0) {
		const command = new Commands.DownstreamKeyTieCommand(key, tie)
		return this.sendCommand(command)
	}

	setDownstreamKeyOnAir (onAir: boolean, key: number = 0) {
		const command = new Commands.DownstreamKeyOnAirCommand(key, onAir)
		return this.sendCommand(command)
	}

	setDownstreamKeyCutSource (input: number, key: number = 0) {
		const command = new Commands.DownstreamKeyCutSourceCommand(key, input)
		return this.sendCommand(command)
	}

	setDownstreamKeyFillSource (input: number, key: number = 0) {
		const command = new Commands.DownstreamKeyFillSourceCommand(key, input)
		return this.sendCommand(command)
	}

	setDownstreamKeyGeneralProperties (props: Partial<DownstreamKeyerGeneral>, key: number = 0) {
		const command = new Commands.DownstreamKeyGeneralCommand(key)
		command.updateProps(props)
		return this.sendCommand(command)
	}

	setDownstreamKeyMaskSettings (props: Partial<DownstreamKeyerMask>, key: number = 0) {
		const command = new Commands.DownstreamKeyMaskCommand(key)
		command.updateProps(props)
		return this.sendCommand(command)
	}

	setDownstreamKeyRate (rate: number, key: number = 0) {
		const command = new Commands.DownstreamKeyRateCommand(key, rate)
		return this.sendCommand(command)
	}

	macroContinue () {
		const command = new Commands.MacroActionCommand(0, Enums.MacroAction.Continue)
		return this.sendCommand(command)
	}

	macroDelete (index = 0) {
		const command = new Commands.MacroActionCommand(index, Enums.MacroAction.Delete)
		return this.sendCommand(command)
	}

	macroInsertUserWait () {
		const command = new Commands.MacroActionCommand(0, Enums.MacroAction.InsertUserWait)
		return this.sendCommand(command)
	}

	macroRun (index: number = 0) {
		const command = new Commands.MacroActionCommand(index, Enums.MacroAction.Run)
		return this.sendCommand(command)
	}

	macroStop () {
		const command = new Commands.MacroActionCommand(0, Enums.MacroAction.Stop)
		return this.sendCommand(command)
	}

	macroStopRecord () {
		const command = new Commands.MacroActionCommand(0, Enums.MacroAction.StopRecord)
		return this.sendCommand(command)
	}

	setMultiViewerSource (newProps: Partial<MultiViewerSourceState>, mv = 0) {
		const command = new Commands.MultiViewerSourceCommand(mv)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setMediaPlayerSettings (newProps: Partial<MediaPlayer>, player: number = 0) {
		const command = new Commands.MediaPlayerStatusCommand(player)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setMediaPlayerSource (newProps: Partial<MediaPlayerSource>, player: number = 0) {
		const command = new Commands.MediaPlayerSourceCommand(player)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setMediaClip (index: number, name: string, frames: number = 1) {
		const command = new Commands.MediaPoolSetClipCommand({ index, name, frames })
		return this.sendCommand(command)
	}

	clearMediaPoolClip (clipId: number) {
		const command = new Commands.MediaPoolClearClipCommand(clipId)
		return this.sendCommand(command)
	}

	clearMediaPoolStill (stillId: number) {
		const command = new Commands.MediaPoolClearStillCommand(stillId)
		return this.sendCommand(command)
	}

	setSuperSourceBoxSettings (newProps: Partial<SuperSourceBox>, box: number = 0, ssrcId: number = 0) {
		const command = new Commands.SuperSourceBoxParametersCommand(ssrcId, box)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setSuperSourceProperties (newProps: Partial<SuperSourceProperties>, ssrcId: number = 0) {
		if (this._state.info.apiVersion >= Enums.ProtocolVersion.V8_0) {
			const command = new Commands.SuperSourcePropertiesV8Command(ssrcId)
			command.updateProps(newProps)
			return this.sendCommand(command)
		} else {
			const command = new Commands.SuperSourcePropertiesCommand()
			command.updateProps(newProps)
			return this.sendCommand(command)
		}
	}

	setSuperSourceBorder (newProps: Partial<SuperSourceBorder>, ssrcId: number = 0) {
		if (this._state.info.apiVersion >= Enums.ProtocolVersion.V8_0) {
			const command = new Commands.SuperSourceBorderCommand(ssrcId)
			command.updateProps(newProps)
			return this.sendCommand(command)
		} else {
			const command = new Commands.SuperSourcePropertiesCommand()
			command.updateProps(newProps)
			return this.sendCommand(command)
		}
	}

	setInputSettings (newProps: Partial<InputChannel>, input: number = 0) {
		const command = new Commands.InputPropertiesCommand(input)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setUpstreamKeyerChromaSettings (newProps: Partial<USK.UpstreamKeyerChromaSettings>, me: number = 0, keyer: number = 0) {
		const command = new Commands.MixEffectKeyChromaCommand(me, keyer)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setUpstreamKeyerCutSource (cutSource: number, me: number = 0, keyer: number = 0) {
		const command = new Commands.MixEffectKeyCutSourceSetCommand(me, keyer, cutSource)
		return this.sendCommand(command)
	}

	setUpstreamKeyerFillSource (fillSource: number, me: number = 0, keyer: number = 0) {
		const command = new Commands.MixEffectKeyFillSourceSetCommand(me, keyer, fillSource)
		return this.sendCommand(command)
	}

	setUpstreamKeyerDVESettings (newProps: Partial<USK.UpstreamKeyerDVESettings>, me: number = 0, keyer: number = 0) {
		const command = new Commands.MixEffectKeyDVECommand(me, keyer)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setUpstreamKeyerLumaSettings (newProps: Partial<USK.UpstreamKeyerLumaSettings>, me: number = 0, keyer: number = 0) {
		const command = new Commands.MixEffectKeyLumaCommand(me, keyer)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setUpstreamKeyerMaskSettings (newProps: Partial<USK.UpstreamKeyerMaskSettings>, me: number = 0, keyer: number = 0) {
		const command = new Commands.MixEffectKeyMaskSetCommand(me, keyer)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setUpstreamKeyerPatternSettings (newProps: Partial<USK.UpstreamKeyerPatternSettings>, me: number = 0, keyer: number = 0) {
		const command = new Commands.MixEffectKeyPatternCommand(me, keyer)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setUpstreamKeyerOnAir (onAir: boolean, me: number = 0, keyer: number = 0) {
		const command = new Commands.MixEffectKeyOnAirCommand(me, keyer, onAir)
		return this.sendCommand(command)
	}

	setUpstreamKeyerType (newProps: Partial<USK.UpstreamKeyerTypeSettings>, me: number = 0, keyer: number = 0) {
		const command = new Commands.MixEffectKeyTypeSetCommand(me, keyer)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	uploadStill (index: number, data: Buffer, name: string, description: string) {
		const resolution = Util.getResolution(this._state.settings.videoMode)
		return this.dataTransferManager.uploadStill(
			index,
			Util.convertRGBAToYUV422(resolution[0], resolution[1], data),
			name,
			description
		)
	}

	uploadClip (index: number, frames: Array<Buffer>, name: string) {
		const resolution = Util.getResolution(this._state.settings.videoMode)
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

	setAudioMixerInputMixOption (index: number, mixOption: Enums.AudioMixOption) {
		const command = new Commands.AudioMixerInputCommand(index)
		command.updateProps({ mixOption })
		return this.sendCommand(command)
	}

	setAudioMixerInputGain (index: number, gain: number) {
		const command = new Commands.AudioMixerInputCommand(index)
		command.updateProps({ gain })
		return this.sendCommand(command)
	}

	setAudioMixerInputBalance (index: number, balance: number) {
		const command = new Commands.AudioMixerInputCommand(index)
		command.updateProps({ balance })
		return this.sendCommand(command)
	}

	setAudioMixerInputProps (index: number, props: Partial<AudioChannel>) {
		const command = new Commands.AudioMixerInputCommand(index)
		command.updateProps(props)
		return this.sendCommand(command)
	}

	setAudioMixerMasterGain (gain: number) {
		const command = new Commands.AudioMixerMasterCommand()
		command.updateProps({ gain })
		return this.sendCommand(command)
	}

	setAudioMixerMasterProps (props: Partial<AudioMasterChannel>) {
		const command = new Commands.AudioMixerMasterCommand()
		command.updateProps(props)
		return this.sendCommand(command)
	}

	private _mutateState (command: IDeserializedCommand) {
		if (isFunction(command.applyToState)) {
			let changePaths = command.applyToState(this._state)
			if (!isArray(changePaths)) {
				changePaths = [ changePaths ]
			}
			changePaths.forEach(path => this.emit('stateChanged', this._state, path))
		}
		for (const commandName in DataTransferCommands) {
			if (command.constructor.name === commandName) {
				this.dataTransferManager.handleCommand(command)
			}
		}
	}

	private _resolveCommand (trackingId: number) {
		const sent = this._sentQueue[trackingId]
		if (sent) {
			sent.resolve(sent.command)
			delete this._sentQueue[trackingId]
		}
	}

	private _rejectCommand (trackingId: number) {
		const sent = this._sentQueue[trackingId]
		if (sent) {
			sent.reject(sent.command)
			delete this._sentQueue[trackingId]
		}
	}
}
