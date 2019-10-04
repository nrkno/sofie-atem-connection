import { EventEmitter } from 'events'
import { AtemState } from './state'
import { AtemSocket } from './lib/atemSocket'
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

	on: ((event: 'error', listener: (message: any) => void) => this) &
		((event: 'connected', listener: () => void) => this) &
		((event: 'disconnected', listener: () => void) => this) &
		((event: 'stateChanged', listener: (state: AtemState, path: string) => void) => this)

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

		// When the parent process begins exiting, remove the listeners on our child process.
		// We do this to avoid throwing an error when the child process exits
		// as a natural part of the parent process exiting.
		exitHook(() => {
			if (this.dataTransferManager) {
				this.dataTransferManager.stop()
			}
		})

		this.socket.on('receivedStateChange', (command: AbstractCommand) => this._mutateState(command))
		this.socket.on(Enums.IPCMessageType.CommandAcknowledged, ({ trackingId }: {trackingId: number}) => this._resolveCommand(trackingId))
		this.socket.on(Enums.IPCMessageType.CommandTimeout, ({ trackingId }: {trackingId: number}) => this._rejectCommand(trackingId))
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
		command.updateProps({ source: input })
		return this.sendCommand(command)
	}

	changePreviewInput (input: number, me = 0) {
		const command = new Commands.PreviewInputCommand()
		command.mixEffect = me
		command.updateProps({ source: input })
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

	fadeToBlack (me = 0) {
		const command = new Commands.FadeToBlackAutoCommand()
		command.mixEffect = me
		return this.sendCommand(command)
	}

	setFadeToBlackRate (rate: number, me: number = 0) {
		const command = new Commands.FadeToBlackRateCommand()
		command.mixEffect = me
		command.properties = { rate }
		return this.sendCommand(command)
	}

	autoDownstreamKey (key = 0, isTowardsOnAir?: boolean) {
		const command = new Commands.DownstreamKeyAutoCommand()
		command.downstreamKeyerId = key
		command.updateProps({ isTowardsOnAir })
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
		command.updateProps({ handlePosition: position })
		return this.sendCommand(command)
	}

	previewTransition (on: boolean, me = 0) {
		const command = new Commands.PreviewTransitionCommand()
		command.mixEffect = me
		command.updateProps({ preview: on })
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
		command.updateProps({ source })
		return this.sendCommand(command)
	}

	setDownstreamKeyTie (tie: boolean, key = 0) {
		const command = new Commands.DownstreamKeyTieCommand()
		command.downstreamKeyerId = key
		command.updateProps({ tie })
		return this.sendCommand(command)
	}

	setDownstreamKeyOnAir (onAir: boolean, key = 0) {
		const command = new Commands.DownstreamKeyOnAirCommand()
		command.downstreamKeyerId = key
		command.updateProps({ onAir })
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
		command.updateProps({ action: Enums.MacroAction.Continue })
		return this.sendCommand(command)
	}

	macroDelete (index = 0) {
		const command = new Commands.MacroActionCommand()
		command.index = index
		command.updateProps({ action: Enums.MacroAction.Delete })
		return this.sendCommand(command)
	}

	macroInsertUserWait () {
		const command = new Commands.MacroActionCommand()
		command.index = 0
		command.updateProps({ action: Enums.MacroAction.InsertUserWait })
		return this.sendCommand(command)
	}

	macroRun (index = 0) {
		const command = new Commands.MacroActionCommand()
		command.index = index
		command.updateProps({ action: Enums.MacroAction.Run })
		return this.sendCommand(command)
	}

	macroStop () {
		const command = new Commands.MacroActionCommand()
		command.index = 0
		command.updateProps({ action: Enums.MacroAction.Stop })
		return this.sendCommand(command)
	}

	macroStopRecord () {
		const command = new Commands.MacroActionCommand()
		command.index = 0
		command.updateProps({ action: Enums.MacroAction.StopRecord })
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

	setSuperSourceBoxSettings (newProps: Partial<SuperSourceBox>, box = 0, ssrcId = 0) {
		const command = new Commands.SuperSourceBoxParametersCommand()
		command.ssrcId = ssrcId
		command.boxId = box
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	setSuperSourceProperties (newProps: Partial<SuperSourceProperties>, ssrcId = 0) {
		if (this.state.info.apiVersion >= Enums.ProtocolVersion.V8_0) {
			const command = new Commands.SuperSourcePropertiesV8Command()
			command.ssrcId = ssrcId
			command.updateProps(newProps)
			return this.sendCommand(command)
		} else {
			const command = new Commands.SuperSourcePropertiesCommand()
			command.updateProps(newProps)
			return this.sendCommand(command)
		}
	}

	setSuperSourceBorder (newProps: Partial<SuperSourceBorder>, ssrcId = 0) {
		if (this.state.info.apiVersion >= Enums.ProtocolVersion.V8_0) {
			const command = new Commands.SuperSourceBorderCommand()
			command.ssrcId = ssrcId
			command.updateProps(newProps)
			return this.sendCommand(command)
		} else {
			const command = new Commands.SuperSourcePropertiesCommand()
			command.updateProps(newProps)
			return this.sendCommand(command)
		}
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
		command.updateProps({ cutSource })
		return this.sendCommand(command)
	}

	setUpstreamKeyerFillSource (fillSource: number, me = 0, keyer = 0) {
		const command = new Commands.MixEffectKeyFillSourceSetCommand()
		command.mixEffect = me
		command.upstreamKeyerId = keyer
		command.updateProps({ fillSource })
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
		command.updateProps({ onAir })
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

	setAudioMixerInputMixOption (index: number, mixOption: Enums.AudioMixOption) {
		const command = new Commands.AudioMixerInputCommand()
		command.index = index
		command.updateProps({ mixOption })
		return this.sendCommand(command)
	}

	setAudioMixerInputGain (index: number, gain: number) {
		const command = new Commands.AudioMixerInputCommand()
		command.index = index
		command.updateProps({ gain })
		return this.sendCommand(command)
	}

	setAudioMixerInputBalance (index: number, balance: number) {
		const command = new Commands.AudioMixerInputCommand()
		command.index = index
		command.updateProps({ balance })
		return this.sendCommand(command)
	}

	setAudioMixerInputProps (index: number, props: Partial<AudioChannel>) {
		const command = new Commands.AudioMixerInputCommand()
		command.index = index
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

	listVisibleInputs (mode: 'program' | 'preview', me = 0): number[] {
		const inputs = new Set<number>()

		// Start with the basics: the surface level of what is in the target ME.
		this._calcActiveMeInputs(mode, me).forEach(i => inputs.add(i))

		// Loop over the active input IDs we've found so far,
		// and check if any of them are SuperSources or other nested MEs.
		// If so, iterate through them and find out what they are showing.
		// Keep looping until we stop discovering new things.
		let lastSize: number
		let lastProcessed = 0
		do {
			// Only processes inputs we haven't already processed.
			// This is an important optimization because this function could potentially
			// be in a hot code path and get called many many times a second,
			// every time the ATEM's state updates.
			lastSize = inputs.size
			Array.from(inputs).slice(lastProcessed).forEach(inputId => {
				if (!this.state.inputs[inputId]) {
					// Data isn't hydrated yet, we'll get 'em next time.
					return
				}
				const portType = this.state.inputs[inputId].internalPortType
				switch (portType) {
					case Enums.InternalPortType.SuperSource:
						const ssrcId = inputId - 6000
						const ssrc = this.state.video.getSuperSource(ssrcId)
						Object.values(ssrc.boxes).forEach(box => {
							if (box.enabled) {
								inputs.add(box.source)
							}
						})
						break
					case Enums.InternalPortType.MEOutput:
						const nestedMeId = ((inputId - (inputId % 10)) - 10000) / 10 - 1
						const nestedMeMode = (inputId - 10000) % 10 === 0 ? 'program' : 'preview'
						this._calcActiveMeInputs(nestedMeMode, nestedMeId).forEach(i => inputs.add(i))
						break
					default:
						// Do nothing.
				}
			})
			lastProcessed = inputs.size - 1
		} while (inputs.size !== lastSize)

		// undefined sometimes sneaks its way in here.
		// Don't know why.
		return Array.from(inputs).filter((i: unknown) => typeof i === 'number').sort((a, b) => a - b)
	}

	private _mutateState (command: AbstractCommand) {
		if (typeof command.applyToState === 'function') {
			let changePaths = command.applyToState(this.state)
			if (!Array.isArray(changePaths)) {
				changePaths = [ changePaths ]
			}
			changePaths.forEach(path => this.emit('stateChanged', this.state, path))
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

	/**
	 * Helper method used by listVisibleInputs.
	 * This got broken out into its own method because
	 * it gets called multiple times, and gets called in a loop.
	 * Breaking it out made listVisibleInputs much easier to read.
	 */
	private _calcActiveMeInputs (mode: 'program' | 'preview', meId: number): number[] {
		const inputs = new Set<number>()
		const meRef = this.state.video.getMe(meId)

		if (mode === 'preview') {
			if (meRef.transitionProperties.selection & 1) {
				inputs.add(meRef.previewInput)
			}
		} else {
			inputs.add(meRef.programInput)
		}

		// Upstream Keyers
		Object.values(meRef.upstreamKeyers).filter(usk => {
			// Pretty gross bitwise operations in this next line, be warned.
			const keyerMask = 1 << (usk.upstreamKeyerId + 1)
			const isPartOfTransition = meRef.transitionProperties.selection & keyerMask
			if (mode === 'program') {
				if (meRef.inTransition) {
					return usk.onAir || isPartOfTransition
				}

				return usk.onAir
			}

			return isPartOfTransition
		}).forEach(usk => {
			inputs.add(usk.fillSource)

			// This is the only USK type that actually uses the cutSource.
			if (usk.mixEffectKeyType === Enums.MixEffectKeyType.Luma) {
				inputs.add(usk.cutSource)
			}
		})

		// DSKs only show up on ME 1,
		// so we only add them if that's the ME we are currently processing.
		if (meId === 0) {
			Object.values(this.state.video.downstreamKeyers).filter(dsk => {
				if (mode === 'program') {
					return dsk.onAir || dsk.inTransition
				}

				if (!dsk.properties) {
					// Data isn't hydrated yet, we'll get 'em next time.
					return false
				}

				return dsk.properties.tie && !dsk.onAir
			}).forEach(dsk => {
				inputs.add(dsk.sources.fillSource)
				inputs.add(dsk.sources.cutSource)
			})
		}

		// Compute what sources are currently participating in a transition.
		// We only care about this for PGM.
		if (meRef.inTransition && mode === 'program') {
			if (meRef.transitionProperties.selection & 1) {
				inputs.add(meRef.previewInput)
			}

			// From here, what inputs are participating in the transition depends
			// on the transition style being used, so we handle each separately.
			switch (meRef.transitionProperties.style) {
				case Enums.TransitionStyle.DIP:
					inputs.add(meRef.transitionSettings.dip.input)
					break
				case Enums.TransitionStyle.DVE:
					inputs.add(meRef.transitionSettings.DVE.fillSource)
					if (meRef.transitionSettings.DVE.enableKey) {
						inputs.add(meRef.transitionSettings.DVE.keySource)
					}
					break
				case Enums.TransitionStyle.WIPE:
					if (meRef.transitionSettings.wipe.borderWidth > 0) {
						inputs.add(meRef.transitionSettings.wipe.borderInput)
					}
					break
				case Enums.TransitionStyle.STING:
					inputs.add(meRef.transitionSettings.stinger.source)
					break
				default:
					// Do nothing.
					// This is the code path that MIX will take.
					// It's already handled above when we add the previewInput
					// to the activeInputs array.
			}
		}

		return Array.from(inputs)
	}
}
