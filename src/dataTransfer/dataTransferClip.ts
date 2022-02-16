import { Commands, Enums } from '..'

import DataTransfer from './dataTransfer'
import DataTransferFrame from './dataTransferFrame'

export default class DataTransferClip extends DataTransfer {
	public readonly clipIndex: number // 0 or 1
	public readonly frames: Generator<DataTransferFrame> | AsyncGenerator<DataTransferFrame>
	public readonly name: string
	public curFrame: DataTransferFrame | undefined
	private numFrames = 0

	constructor(
		clipIndex: number,
		name: string,
		frames: Generator<DataTransferFrame> | AsyncGenerator<DataTransferFrame>
	) {
		super(0, 1 + clipIndex)

		this.clipIndex = clipIndex
		this.name = name
		this.frames = frames
	}

	public async start(): Promise<Commands.ISerializableCommand[]> {
		const commands: Commands.ISerializableCommand[] = []
		commands.push(new Commands.MediaPoolClearClipCommand(this.clipIndex))
		this.curFrame = await (await this.frames.next()).value
		if (!this.curFrame) {
			throw new Error('No frames available for transfer')
		}
		this.numFrames++
		this.curFrame.state = Enums.TransferState.Locked
		commands.push(...(await this.curFrame.start()))
		return commands
	}

	public async handleCommand(command: Commands.IDeserializedCommand): Promise<Commands.ISerializableCommand[]> {
		const commands: Commands.ISerializableCommand[] = []

		if (!this.curFrame) {
			throw new Error('No frames available for transfer')
		}
		commands.push(...(await this.curFrame.handleCommand(command)))
		if (this.state !== Enums.TransferState.Transferring) this.state = Enums.TransferState.Transferring
		if (this.curFrame.state === Enums.TransferState.Finished) {
			this.curFrame = await (await this.frames.next()).value
			if (this.curFrame) {
				this.numFrames++
				this.curFrame.state = Enums.TransferState.Locked
				commands.push(...(await this.curFrame.start()))
			} else {
				const command = new Commands.MediaPoolSetClipCommand({
					index: this.clipIndex,
					name: this.name,
					frames: this.numFrames,
				})
				commands.push(command)
				this.state = Enums.TransferState.Finished
			}
		}

		return commands
	}

	get transferId(): number {
		if (!this.curFrame) {
			return this._transferId
		}

		return this.curFrame.transferId
	}

	public async gotLock(): Promise<Commands.ISerializableCommand[]> {
		this.state = Enums.TransferState.Locked
		return this.start()
	}
}
