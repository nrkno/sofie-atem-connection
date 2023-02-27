import { EventEmitter } from 'eventemitter3'
import { AtemState, AtemStateUtil, InvalidIdError } from './state'
import { AtemSocket } from './lib/atemSocket'
import { ISerializableCommand, IDeserializedCommand } from './commands/CommandBase'
import * as Commands from './commands'
import * as DataTransferCommands from './commands/DataTransfer'
import * as DT from './dataTransfer'
import * as Util from './lib/atemUtil'
import { listVisibleInputs } from './lib/tally'
import {
	calculateGenerateMultiviewerLabelProps,
	generateMultiviewerLabel,
	hasInternalMultiviewerLabelGeneration,
	loadFont,
} from './lib/multiviewLabel'
import { FontFace } from '@julusian/freetype2'
import PLazy = require('p-lazy')
import { TimeCommand } from './commands'
import { TimeInfo } from './state/info'
import { AtemCommandSender } from './lib/atemCommands'
import { ProtocolVersion } from './enums'

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
	updatedTime: [TimeInfo]
}

interface SentCommand {
	command: ISerializableCommand
	resolve: () => void
	reject: () => void
}

export enum AtemConnectionStatus {
	CLOSED,
	CONNECTING,
	CONNECTED,
}

export const DEFAULT_PORT = 9910

export class BasicAtem extends EventEmitter<AtemEvents> {
	private readonly socket: AtemSocket
	public readonly dataTransferManager: DT.DataTransferManager // TODO - avoid public
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
			childProcessTimeout: (options || {}).childProcessTimeout || 600,
		})
		this.dataTransferManager = new DT.DataTransferManager(this.sendCommands.bind(this))

		this.socket.on('commandsReceived', (commands) => {
			this.emit('receivedCommands', commands)
			this._mutateState(commands)
		})
		this.socket.on('commandsAck', (trackingIds) => this._resolveCommands(trackingIds))
		this.socket.on('info', (msg) => this.emit('info', msg))
		this.socket.on('debug', (msg) => this.emit('debug', msg))
		this.socket.on('error', (e) => this.emit('error', e))
		this.socket.on('disconnect', () => {
			this._status = AtemConnectionStatus.CLOSED
			this.dataTransferManager.stopCommandSending()
			this._rejectAllCommands()
			this.emit('disconnected')
			this._state = undefined
		})
	}

	private _onInitComplete(): void {
		this.dataTransferManager.startCommandSending()
		this.emit('connected')
	}

	get status(): AtemConnectionStatus {
		return this._status
	}

	get state(): Readonly<AtemState> | undefined {
		return this._state
	}

	public async connect(address: string, port?: number): Promise<void> {
		return this.socket.connect(address, port)
	}

	public async disconnect(): Promise<void> {
		return this.socket.disconnect()
	}

	public async destroy(): Promise<void> {
		this.dataTransferManager.stopCommandSending()
		return this.socket.destroy()
	}

	private sendCommands(commands: ISerializableCommand[]): Array<Promise<void>> {
		const commands2 = commands.map((cmd) => ({
			rawCommand: cmd,
			trackingId: this.socket.nextCommandTrackingId,
		}))

		const sendPromise = this.socket.sendCommands(commands2)

		return commands2.map(async (cmd) => {
			await sendPromise
			return new Promise<void>((resolve, reject) => {
				this._sentQueue[cmd.trackingId] = {
					command: cmd.rawCommand,
					resolve,
					reject,
				}
			})
		})
	}

	public async sendCommand(command: ISerializableCommand): Promise<void> {
		return this.sendCommands([command])[0]
	}

	private _mutateState(commands: IDeserializedCommand[]): void {
		// Is this the start of a new connection?
		if (commands.find((cmd) => cmd.constructor.name === Commands.VersionCommand.name)) {
			// On start of connection, create a new state object
			this._state = AtemStateUtil.Create()
			this._status = AtemConnectionStatus.CONNECTING
		}

		const allChangedPaths: string[] = []

		const state = this._state
		for (const command of commands) {
			if (command instanceof TimeCommand) {
				this.emit('updatedTime', command.properties)
			} else if (state) {
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
							`Invalid command id: ${e}. Command: ${command.constructor.name} ${Util.commandStringify(
								command
							)}`
						)
					} else {
						this.emit(
							'error',
							`MutateState failed: ${e}. Command: ${command.constructor.name} ${Util.commandStringify(
								command
							)}`
						)
					}
				}
			}

			for (const commandName in DataTransferCommands) {
				// TODO - this is fragile
				if (command.constructor.name === commandName) {
					this.dataTransferManager.queueHandleCommand(command)
				}
			}
		}

		const initComplete = commands.find((cmd) => cmd.constructor.name === Commands.InitCompleteCommand.name)
		if (initComplete) {
			this._status = AtemConnectionStatus.CONNECTED
			this._onInitComplete()
		} else if (state && this._status === AtemConnectionStatus.CONNECTED && allChangedPaths.length > 0) {
			this.emit('stateChanged', state, allChangedPaths)
		}
	}

	private _resolveCommands(trackingIds: number[]): void {
		trackingIds.forEach((trackingId) => {
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

		Object.values(sentQueue).forEach((sent) => sent.reject())
	}
}

export class Atem extends AtemCommandSender<Promise<void>> {
	#client: BasicAtem
	#multiviewerFontFace: Promise<FontFace>
	#multiviewerFontScale: number

	protected get apiVersion(): ProtocolVersion | undefined {
		return this.state?.info?.apiVersion
	}

	constructor(options?: AtemOptions) {
		super()

		this.#client = new BasicAtem(options)

		this.#multiviewerFontFace = PLazy.from(async () => loadFont())
		this.#multiviewerFontScale = 1.0
	}

	get status(): AtemConnectionStatus {
		return this.#client.status
	}

	get state(): Readonly<AtemState> | undefined {
		return this.#client.state
	}

	public async connect(address: string, port?: number): Promise<void> {
		return this.#client.connect(address, port)
	}

	public async disconnect(): Promise<void> {
		return this.#client.disconnect()
	}

	public async destroy(): Promise<void> {
		return this.#client.destroy()
	}

	public async sendCommand(command: ISerializableCommand): Promise<void> {
		return this.#client.sendCommand(command)
	}

	/**
	 * Set the font to use for the multiviewer, or reset to default
	 */
	public async setMultiviewerFontFace(font: FontFace | string | null): Promise<void> {
		let loadedFont: FontFace
		if (font) {
			if (typeof font === 'string') {
				loadedFont = await loadFont(font)
			} else {
				loadedFont = font
			}
		} else {
			loadedFont = await loadFont()
		}

		this.#multiviewerFontFace = Promise.resolve(loadedFont)
	}
	/**
	 * Set the scale factor for the multiviewer text. Default is 1
	 */
	public setMultiviewerFontScale(scale: number | null): void {
		if (typeof scale === 'number') {
			if (scale <= 0) throw new Error('Scale must be greater than 0')
			this.#multiviewerFontScale = scale
		} else if (scale === null) {
			this.#multiviewerFontScale = 1.0
		}
	}

	public async downloadMacro(index: number): Promise<Buffer> {
		return this.#client.dataTransferManager.downloadMacro(index)
	}
	public async uploadMacro(index: number, name: string, data: Buffer): Promise<void> {
		return this.#client.dataTransferManager.uploadMacro(index, data, name)
	}

	public async uploadStill(index: number, data: Buffer, name: string, description: string): Promise<void> {
		if (!this.#client.state) return Promise.reject()
		const resolution = Util.getVideoModeInfo(this.#client.state.settings.videoMode)
		if (!resolution) return Promise.reject()
		return this.#client.dataTransferManager.uploadStill(
			index,
			Util.convertRGBAToYUV422(resolution.width, resolution.height, data),
			name,
			description
		)
	}

	public async uploadClip(
		index: number,
		frames: Iterable<Buffer> | AsyncIterable<Buffer>,
		name: string
	): Promise<void> {
		if (!this.#client.state) return Promise.reject()
		const resolution = Util.getVideoModeInfo(this.#client.state.settings.videoMode)
		if (!resolution) return Promise.reject()
		const provideFrame = async function* (): AsyncGenerator<Buffer> {
			for await (const frame of frames) {
				yield Util.convertRGBAToYUV422(resolution.width, resolution.height, frame)
			}
		}
		return this.#client.dataTransferManager.uploadClip(index, provideFrame(), name)
	}

	public async uploadAudio(index: number, data: Buffer, name: string): Promise<void> {
		return this.#client.dataTransferManager.uploadAudio(
			index,
			Util.convertWAVToRaw(data, this.#client.state?.info?.model),
			name
		)
	}

	public listVisibleInputs(mode: 'program' | 'preview', me = 0): number[] {
		if (this.#client.state) {
			return listVisibleInputs(mode, this.#client.state, me)
		} else {
			return []
		}
	}

	public hasInternalMultiviewerLabelGeneration(): boolean {
		return !!this.#client.state && hasInternalMultiviewerLabelGeneration(this.#client.state?.info.model)
	}

	/**
	 * Write a custom multiviewer label buffer
	 * @param inputId The input id
	 * @param buffer Label buffer
	 * @returns Promise that resolves once upload is complete
	 */
	public async writeMultiviewerLabel(inputId: number, buffer: Buffer): Promise<void> {
		if (this.hasInternalMultiviewerLabelGeneration()) throw new Error(`ATEM doesn't support custom labels`)

		// Verify the buffer doesnt contain data that is 'out of bounds' and will crash the atem
		const badValues = new Set([255, 254])
		for (const val of buffer) {
			if (badValues.has(val)) {
				throw new Error(`Buffer contains invalid value ${val}`)
			}
		}

		return this.#client.dataTransferManager.uploadMultiViewerLabel(inputId, buffer)
	}

	/**
	 * Generate and upload a multiviewer label
	 * @param inputId The input id
	 * @param text Label text
	 * @returns Promise that resolves once upload is complete
	 */
	public async drawMultiviewerLabel(inputId: number, text: string): Promise<void> {
		if (this.hasInternalMultiviewerLabelGeneration()) throw new Error(`ATEM doesn't support custom labels`)

		const props = calculateGenerateMultiviewerLabelProps(this.#client.state ?? null)
		if (!props) throw new Error(`Failed to determine render properties`)

		const fontFace = await this.#multiviewerFontFace

		const buffer = generateMultiviewerLabel(fontFace, this.#multiviewerFontScale, text, props)
		// Note: we should probably validate the buffer looks like it doesn't contain crashy data, but as we generate we can trust it
		return this.#client.dataTransferManager.uploadMultiViewerLabel(inputId, buffer)
	}
}
