import { EventEmitter } from 'eventemitter3'
import { AtemState, AtemStateUtil, InvalidIdError } from './state'
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
	SuperSource,
	TransitionProperties,
	WipeTransitionSettings
} from './state/video'
import * as USK from './state/video/upstreamKeyers'
import { InputChannel } from './state/input'
import { DownstreamKeyerGeneral, DownstreamKeyerMask } from './state/video/downstreamKeyers'
import * as DT from './dataTransfer'
import * as Util from './lib/atemUtil'
import * as Enums from './enums'
import { AudioChannel, AudioMasterChannel } from './state/audio'
import { listVisibleInputs } from './lib/tally'
import DataTransfer from './dataTransfer/dataTransfer'
import { RecordingStateProperties } from './state/recording'
import { OmitReadonly } from './lib/types'
import { StreamingServiceProperties } from './state/streaming'
import { commandStringify } from './lib/atemUtil'

export interface AtemOptions {
	address?: string
	port?: number
	debugBuffers?: boolean
	disableMultithreaded?: boolean
	childProcessTimeout?: number
}

export type AtemEvents = {
	error: [string]
	info: [string]
	debug: [string]
	connected: []
	disconnected: []
	stateChanged: [AtemState, string[]]
	receivedCommands: [IDeserializedCommand[]]
}

interface SentCommand {
	command: ISerializableCommand
	resolve: () => void
	reject: () => void
}

export enum AtemConnectionStatus {
	CLOSED,
	CONNECTING,
	CONNECTED
}

export const DEFAULT_PORT = 9910

export class BasicAtem extends EventEmitter<AtemEvents> {
	private readonly socket: AtemSocket
	protected readonly dataTransferManager: DT.DataTransferManager
	private _state: AtemState | undefined
	private _sentQueue: { [packetId: string]: SentCommand } = {}
	private _status: AtemConnectionStatus

	constructor(options?: AtemOptions) {
		super()

		this._state = AtemStateUtil.Create()
		this._status = AtemConnectionStatus.CLOSED
		this.socket = new AtemSocket({
			debugBuffers: (options || {}).debugBuffers || false,
			address: (options || {}).address || '',
			port: (options || {}).port || DEFAULT_PORT,
			disableMultithreaded: (options || {}).disableMultithreaded || false,
			childProcessTimeout: (options || {}).childProcessTimeout || 600
		})
		this.dataTransferManager = new DT.DataTransferManager()

		this.socket.on('commandsReceived', commands => {
			this.emit('receivedCommands', commands)
			this._mutateState(commands)
		})
		this.socket.on('commandsAck', trackingIds => this._resolveCommands(trackingIds))
		this.socket.on('info', msg => this.emit('info', msg))
		this.socket.on('debug', msg => this.emit('debug', msg))
		this.socket.on('error', e => this.emit('error', e))
		this.socket.on('disconnect', () => {
			this._status = AtemConnectionStatus.CLOSED
			this.dataTransferManager.stopCommandSending()
			this._rejectAllCommands()
			this.emit('disconnected')
			this._state = undefined
		})
	}

	private _onInitComplete(): void {
		this.dataTransferManager.startCommandSending(cmds => this.sendCommands(cmds))
		this.emit('connected')
	}

	get status(): AtemConnectionStatus {
		return this._status
	}

	get state(): Readonly<AtemState> | undefined {
		return this._state
	}

	public connect(address: string, port?: number): Promise<void> {
		return this.socket.connect(address, port)
	}

	public disconnect(): Promise<void> {
		return this.socket.disconnect()
	}

	public destroy(): Promise<void> {
		return this.socket.destroy()
	}

	private sendCommands(commands: ISerializableCommand[]): Array<Promise<void>> {
		const commands2 = commands.map(cmd => ({
			rawCommand: cmd,
			trackingId: this.socket.nextCommandTrackingId
		}))

		const sendPromise = this.socket.sendCommands(commands2)

		return commands2.map(async cmd => {
			await sendPromise
			return new Promise<void>((resolve, reject) => {
				this._sentQueue[cmd.trackingId] = {
					command: cmd.rawCommand,
					resolve,
					reject
				}
			})
		})
	}

	public sendCommand(command: ISerializableCommand): Promise<void> {
		return this.sendCommands([command])[0]
	}

	private _mutateState(commands: IDeserializedCommand[]): void {
		// Is this the start of a new connection?
		if (commands.find(cmd => cmd.constructor.name === Commands.VersionCommand.name)) {
			// On start of connection, create a new state object
			this._state = AtemStateUtil.Create()
			this._status = AtemConnectionStatus.CONNECTING
		}

		const allChangedPaths: string[] = []

		const state = this._state
		commands.forEach(command => {
			if (state) {
				try {
					const changePaths = command.applyToState(state)
					if (!Array.isArray(changePaths)) {
						allChangedPaths.push(changePaths)
					} else {
						allChangedPaths.push(...changePaths)
					}
				} catch (e) {
					if (e instanceof InvalidIdError) {
						this.emit(
							'debug',
							`Invalid command id: ${e}. Command: ${command.constructor.name} ${commandStringify(
								command
							)}`
						)
					} else {
						this.emit(
							'error',
							`MutateState failed: ${e}. Command: ${command.constructor.name} ${commandStringify(
								command
							)}`
						)
					}
				}
			}

			for (const commandName in DataTransferCommands) {
				if (command.constructor.name === commandName) {
					this.dataTransferManager.handleCommand(command)
				}
			}
		})

		const initComplete = commands.find(cmd => cmd.constructor.name === Commands.InitCompleteCommand.name)
		if (initComplete) {
			this._status = AtemConnectionStatus.CONNECTED
			this._onInitComplete()
		} else if (state && this._status === AtemConnectionStatus.CONNECTED && allChangedPaths.length > 0) {
			this.emit('stateChanged', state, allChangedPaths)
		}
	}

	private _resolveCommands(trackingIds: number[]): void {
		trackingIds.forEach(trackingId => {
			const sent = this._sentQueue[trackingId]
			if (sent) {
				sent.resolve()
				delete this._sentQueue[trackingId]
			}
		})
	}

	private _rejectAllCommands(): void {
		// Take a copy in case the promises cause more mutations
		const sentQueue = this._sentQueue
		this._sentQueue = {}

		Object.values(sentQueue).forEach(sent => sent.reject())
	}
}

export class Atem extends BasicAtem {
	constructor(options?: AtemOptions) {
		super(options)
	}

	public changeProgramInput(input: number, me = 0): Promise<void> {
		const command = new Commands.ProgramInputCommand(me, input)
		return this.sendCommand(command)
	}

	public changePreviewInput(input: number, me = 0): Promise<void> {
		const command = new Commands.PreviewInputCommand(me, input)
		return this.sendCommand(command)
	}

	public cut(me = 0): Promise<void> {
		const command = new Commands.CutCommand(me)
		return this.sendCommand(command)
	}

	public autoTransition(me = 0): Promise<void> {
		const command = new Commands.AutoTransitionCommand(me)
		return this.sendCommand(command)
	}

	public fadeToBlack(me = 0): Promise<void> {
		const command = new Commands.FadeToBlackAutoCommand(me)
		return this.sendCommand(command)
	}

	public setFadeToBlackRate(rate: number, me = 0): Promise<void> {
		const command = new Commands.FadeToBlackRateCommand(me, rate)
		return this.sendCommand(command)
	}

	public autoDownstreamKey(key = 0, isTowardsOnAir?: boolean): Promise<void> {
		const command = new Commands.DownstreamKeyAutoCommand(key)
		command.updateProps({ isTowardsOnAir })
		return this.sendCommand(command)
	}

	public setDipTransitionSettings(newProps: Partial<DipTransitionSettings>, me = 0): Promise<void> {
		const command = new Commands.TransitionDipCommand(me)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	public setDVETransitionSettings(newProps: Partial<DVETransitionSettings>, me = 0): Promise<void> {
		const command = new Commands.TransitionDVECommand(me)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	public setMixTransitionSettings(newProps: Pick<MixTransitionSettings, 'rate'>, me = 0): Promise<void> {
		const command = new Commands.TransitionMixCommand(me, newProps.rate)
		return this.sendCommand(command)
	}

	public setTransitionPosition(position: number, me = 0): Promise<void> {
		const command = new Commands.TransitionPositionCommand(me, position)
		return this.sendCommand(command)
	}

	public previewTransition(on: boolean, me = 0): Promise<void> {
		const command = new Commands.PreviewTransitionCommand(me, on)
		return this.sendCommand(command)
	}

	public setTransitionStyle(newProps: Partial<OmitReadonly<TransitionProperties>>, me = 0): Promise<void> {
		const command = new Commands.TransitionPropertiesCommand(me)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	public setStingerTransitionSettings(newProps: Partial<StingerTransitionSettings>, me = 0): Promise<void> {
		const command = new Commands.TransitionStingerCommand(me)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	public setWipeTransitionSettings(newProps: Partial<WipeTransitionSettings>, me = 0): Promise<void> {
		const command = new Commands.TransitionWipeCommand(me)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	public setAuxSource(source: number, bus = 0): Promise<void> {
		const command = new Commands.AuxSourceCommand(bus, source)
		return this.sendCommand(command)
	}

	public setDownstreamKeyTie(tie: boolean, key = 0): Promise<void> {
		const command = new Commands.DownstreamKeyTieCommand(key, tie)
		return this.sendCommand(command)
	}

	public setDownstreamKeyOnAir(onAir: boolean, key = 0): Promise<void> {
		const command = new Commands.DownstreamKeyOnAirCommand(key, onAir)
		return this.sendCommand(command)
	}

	public setDownstreamKeyCutSource(input: number, key = 0): Promise<void> {
		const command = new Commands.DownstreamKeyCutSourceCommand(key, input)
		return this.sendCommand(command)
	}

	public setDownstreamKeyFillSource(input: number, key = 0): Promise<void> {
		const command = new Commands.DownstreamKeyFillSourceCommand(key, input)
		return this.sendCommand(command)
	}

	public setDownstreamKeyGeneralProperties(props: Partial<DownstreamKeyerGeneral>, key = 0): Promise<void> {
		const command = new Commands.DownstreamKeyGeneralCommand(key)
		command.updateProps(props)
		return this.sendCommand(command)
	}

	public setDownstreamKeyMaskSettings(props: Partial<DownstreamKeyerMask>, key = 0): Promise<void> {
		const command = new Commands.DownstreamKeyMaskCommand(key)
		command.updateProps(props)
		return this.sendCommand(command)
	}

	public setDownstreamKeyRate(rate: number, key = 0): Promise<void> {
		const command = new Commands.DownstreamKeyRateCommand(key, rate)
		return this.sendCommand(command)
	}

	public setTime(hour: number, minute: number, second: number, frame: number): Promise<void> {
		const command = new Commands.TimeCommand({ hour, minute, second, frame })
		return this.sendCommand(command)
	}

	public requestTime(): Promise<void> {
		const command = new Commands.TimeRequestCommand()
		return this.sendCommand(command)
	}

	public macroContinue(): Promise<void> {
		const command = new Commands.MacroActionCommand(0, Enums.MacroAction.Continue)
		return this.sendCommand(command)
	}

	public macroDelete(index = 0): Promise<void> {
		const command = new Commands.MacroActionCommand(index, Enums.MacroAction.Delete)
		return this.sendCommand(command)
	}

	public macroInsertUserWait(): Promise<void> {
		const command = new Commands.MacroActionCommand(0, Enums.MacroAction.InsertUserWait)
		return this.sendCommand(command)
	}

	public macroInsertTimedWait(frames: number): Promise<void> {
		const command = new Commands.MacroAddTimedPauseCommand(frames)
		return this.sendCommand(command)
	}

	public macroRun(index = 0): Promise<void> {
		const command = new Commands.MacroActionCommand(index, Enums.MacroAction.Run)
		return this.sendCommand(command)
	}

	public macroStop(): Promise<void> {
		const command = new Commands.MacroActionCommand(0, Enums.MacroAction.Stop)
		return this.sendCommand(command)
	}

	public macroStartRecord(index: number, name: string, description: string): Promise<void> {
		const command = new Commands.MacroRecordCommand(index, name, description)
		return this.sendCommand(command)
	}

	public macroStopRecord(): Promise<void> {
		const command = new Commands.MacroActionCommand(0, Enums.MacroAction.StopRecord)
		return this.sendCommand(command)
	}

	public macroUpdateProperties(props: Commands.MacroPropertiesCommand['properties'], index = 0): Promise<void> {
		const command = new Commands.MacroPropertiesCommand(index)
		command.updateProps(props)
		return this.sendCommand(command)
	}

	public macroSetLoop(loop: boolean): Promise<void> {
		const command = new Commands.MacroRunStatusCommand()
		command.updateProps({ loop })
		return this.sendCommand(command)
	}

	public setMultiViewerSource(newProps: OmitReadonly<MultiViewerSourceState>, mv = 0): Promise<void> {
		const command = new Commands.MultiViewerSourceCommand(mv, newProps.windowIndex, newProps.source)
		return this.sendCommand(command)
	}

	public setMediaPlayerSettings(newProps: Partial<MediaPlayer>, player = 0): Promise<void> {
		const command = new Commands.MediaPlayerStatusCommand(player)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	public setMediaPlayerSource(newProps: Partial<MediaPlayerSource>, player = 0): Promise<void> {
		const command = new Commands.MediaPlayerSourceCommand(player)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	public setMediaClip(index: number, name: string, frames = 1): Promise<void> {
		const command = new Commands.MediaPoolSetClipCommand({ index, name, frames })
		return this.sendCommand(command)
	}

	public clearMediaPoolClip(clipId: number): Promise<void> {
		const command = new Commands.MediaPoolClearClipCommand(clipId)
		return this.sendCommand(command)
	}

	public clearMediaPoolStill(stillId: number): Promise<void> {
		const command = new Commands.MediaPoolClearStillCommand(stillId)
		return this.sendCommand(command)
	}

	public setSuperSourceBoxSettings(
		newProps: Partial<SuperSource.SuperSourceBox>,
		box = 0,
		ssrcId = 0
	): Promise<void> {
		const command = new Commands.SuperSourceBoxParametersCommand(ssrcId, box)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	public setSuperSourceProperties(newProps: Partial<SuperSource.SuperSourceProperties>, ssrcId = 0): Promise<void> {
		if (this.state && this.state.info.apiVersion >= Enums.ProtocolVersion.V8_0) {
			const command = new Commands.SuperSourcePropertiesV8Command(ssrcId)
			command.updateProps(newProps)
			return this.sendCommand(command)
		} else {
			const command = new Commands.SuperSourcePropertiesCommand()
			command.updateProps(newProps)
			return this.sendCommand(command)
		}
	}

	public setSuperSourceBorder(newProps: Partial<SuperSource.SuperSourceBorder>, ssrcId = 0): Promise<void> {
		if (this.state && this.state.info.apiVersion >= Enums.ProtocolVersion.V8_0) {
			const command = new Commands.SuperSourceBorderCommand(ssrcId)
			command.updateProps(newProps)
			return this.sendCommand(command)
		} else {
			const command = new Commands.SuperSourcePropertiesCommand()
			command.updateProps(newProps)
			return this.sendCommand(command)
		}
	}

	public setInputSettings(newProps: Partial<OmitReadonly<InputChannel>>, input = 0): Promise<void> {
		const command = new Commands.InputPropertiesCommand(input)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	public setUpstreamKeyerChromaSettings(
		newProps: Partial<USK.UpstreamKeyerChromaSettings>,
		me = 0,
		keyer = 0
	): Promise<void> {
		const command = new Commands.MixEffectKeyChromaCommand(me, keyer)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	public setUpstreamKeyerCutSource(cutSource: number, me = 0, keyer = 0): Promise<void> {
		const command = new Commands.MixEffectKeyCutSourceSetCommand(me, keyer, cutSource)
		return this.sendCommand(command)
	}

	public setUpstreamKeyerFillSource(fillSource: number, me = 0, keyer = 0): Promise<void> {
		const command = new Commands.MixEffectKeyFillSourceSetCommand(me, keyer, fillSource)
		return this.sendCommand(command)
	}

	public setUpstreamKeyerDVESettings(
		newProps: Partial<USK.UpstreamKeyerDVESettings>,
		me = 0,
		keyer = 0
	): Promise<void> {
		const command = new Commands.MixEffectKeyDVECommand(me, keyer)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	public setUpstreamKeyerLumaSettings(
		newProps: Partial<USK.UpstreamKeyerLumaSettings>,
		me = 0,
		keyer = 0
	): Promise<void> {
		const command = new Commands.MixEffectKeyLumaCommand(me, keyer)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	public setUpstreamKeyerMaskSettings(
		newProps: Partial<USK.UpstreamKeyerMaskSettings>,
		me = 0,
		keyer = 0
	): Promise<void> {
		const command = new Commands.MixEffectKeyMaskSetCommand(me, keyer)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	public setUpstreamKeyerPatternSettings(
		newProps: Partial<USK.UpstreamKeyerPatternSettings>,
		me = 0,
		keyer = 0
	): Promise<void> {
		const command = new Commands.MixEffectKeyPatternCommand(me, keyer)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	public setUpstreamKeyerOnAir(onAir: boolean, me = 0, keyer = 0): Promise<void> {
		const command = new Commands.MixEffectKeyOnAirCommand(me, keyer, onAir)
		return this.sendCommand(command)
	}

	public setUpstreamKeyerType(newProps: Partial<USK.UpstreamKeyerTypeSettings>, me = 0, keyer = 0): Promise<void> {
		const command = new Commands.MixEffectKeyTypeSetCommand(me, keyer)
		command.updateProps(newProps)
		return this.sendCommand(command)
	}

	public uploadStill(index: number, data: Buffer, name: string, description: string): Promise<DataTransfer> {
		if (!this.state) return Promise.reject()
		const resolution = Util.getVideoModeInfo(this.state.settings.videoMode)
		if (!resolution) return Promise.reject()
		return this.dataTransferManager.uploadStill(
			index,
			Util.convertRGBAToYUV422(resolution.width, resolution.height, data),
			name,
			description
		)
	}

	public uploadClip(index: number, frames: Array<Buffer>, name: string): Promise<DataTransfer> {
		if (!this.state) return Promise.reject()
		const resolution = Util.getVideoModeInfo(this.state.settings.videoMode)
		if (!resolution) return Promise.reject()
		const data: Array<Buffer> = []
		for (const frame of frames) {
			data.push(Util.convertRGBAToYUV422(resolution.width, resolution.height, frame))
		}
		return this.dataTransferManager.uploadClip(index, data, name)
	}

	public uploadAudio(index: number, data: Buffer, name: string): Promise<DataTransfer> {
		return this.dataTransferManager.uploadAudio(index, Util.convertWAVToRaw(data), name)
	}

	public setAudioMixerInputMixOption(index: number, mixOption: Enums.AudioMixOption): Promise<void> {
		const command = new Commands.AudioMixerInputCommand(index)
		command.updateProps({ mixOption })
		return this.sendCommand(command)
	}

	public setAudioMixerInputGain(index: number, gain: number): Promise<void> {
		const command = new Commands.AudioMixerInputCommand(index)
		command.updateProps({ gain })
		return this.sendCommand(command)
	}

	public setAudioMixerInputBalance(index: number, balance: number): Promise<void> {
		const command = new Commands.AudioMixerInputCommand(index)
		command.updateProps({ balance })
		return this.sendCommand(command)
	}

	public setAudioMixerInputProps(index: number, props: Partial<OmitReadonly<AudioChannel>>): Promise<void> {
		const command = new Commands.AudioMixerInputCommand(index)
		command.updateProps(props)
		return this.sendCommand(command)
	}

	public setAudioMixerMasterGain(gain: number): Promise<void> {
		const command = new Commands.AudioMixerMasterCommand()
		command.updateProps({ gain })
		return this.sendCommand(command)
	}

	public setAudioMixerMasterProps(props: Partial<AudioMasterChannel>): Promise<void> {
		const command = new Commands.AudioMixerMasterCommand()
		command.updateProps(props)
		return this.sendCommand(command)
	}

	public setFairlightAudioMixerInputProps(
		index: number,
		props: Commands.FairlightMixerInputCommand['properties']
	): Promise<void> {
		if (this.state && this.state.info.apiVersion >= Enums.ProtocolVersion.V8_0) {
			const command = new Commands.FairlightMixerInputV8Command(index)
			command.updateProps(props)
			return this.sendCommand(command)
		} else {
			const command = new Commands.FairlightMixerInputCommand(index)
			command.updateProps(props)
			return this.sendCommand(command)
		}
	}

	public setFairlightAudioMixerSourceProps(
		index: number,
		source: string,
		props: Commands.FairlightMixerSourceCommand['properties']
	): Promise<void> {
		const command = new Commands.FairlightMixerSourceCommand(index, BigInt(source))
		command.updateProps(props)
		return this.sendCommand(command)
	}

	public startStreaming(): Promise<void> {
		const command = new Commands.StreamingStatusCommand(true)
		return this.sendCommand(command)
	}

	public stopStreaming(): Promise<void> {
		const command = new Commands.StreamingStatusCommand(false)
		return this.sendCommand(command)
	}

	public requestStreamingDuration(): Promise<void> {
		const command = new Commands.StreamingRequestDurationCommand()
		return this.sendCommand(command)
	}

	public setStreamingService(props: Partial<StreamingServiceProperties>): Promise<void> {
		const command = new Commands.StreamingServiceCommand()
		command.updateProps(props)
		return this.sendCommand(command)
	}

	public startRecording(): Promise<void> {
		const command = new Commands.RecordingStatusCommand(true)
		return this.sendCommand(command)
	}

	public stopRecording(): Promise<void> {
		const command = new Commands.RecordingStatusCommand(false)
		return this.sendCommand(command)
	}

	public requestRecordingDuration(): Promise<void> {
		const command = new Commands.RecordingRequestDurationCommand()
		return this.sendCommand(command)
	}

	public switchRecordingDisk(): Promise<void> {
		const command = new Commands.RecordingRequestSwitchDiskCommand()
		return this.sendCommand(command)
	}

	public setRecordingSettings(props: Partial<RecordingStateProperties>): Promise<void> {
		const command = new Commands.RecordingSettingsCommand()
		command.updateProps(props)
		return this.sendCommand(command)
	}

	public listVisibleInputs(mode: 'program' | 'preview', me = 0): number[] {
		if (this.state) {
			return listVisibleInputs(mode, this.state, me)
		} else {
			return []
		}
	}
}
