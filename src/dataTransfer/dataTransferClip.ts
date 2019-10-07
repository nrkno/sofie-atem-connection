import { Commands, Enums } from '..'

import DataTransfer from './dataTransfer'
import DataTransferFrame from './dataTransferFrame'

export default class DataTransferClip extends DataTransfer {
	readonly clipIndex: number // 0 or 1
	frames: Array<DataTransferFrame> = []
	curFrame = 0
	readonly name: string

	constructor (clipIndex: number, name: string) {
		super(0, 1 + clipIndex)

		this.clipIndex = clipIndex
		this.name = name
	}

	start () {
		const clearMediaCommand = new Commands.MediaPoolClearClipCommand()
		clearMediaCommand.updateProps({
			index: this.clipIndex
		})
		this.commandQueue.push(clearMediaCommand)
		this.frames[this.curFrame].state = Enums.TransferState.Locked
		this.frames[this.curFrame].start()
	}

	handleCommand (command: Commands.AbstractCommand) {
		this.frames[this.curFrame].handleCommand(command)
		if (this.state !== Enums.TransferState.Transferring) this.state = Enums.TransferState.Transferring
		if (this.frames[this.curFrame].state === Enums.TransferState.Finished) {
			this.curFrame++
			if (this.curFrame < this.frames.length) {
				this.frames[this.curFrame].state = Enums.TransferState.Locked
				this.frames[this.curFrame].start()
			} else {
				const command = new Commands.MediaPoolSetClipCommand()
				command.updateProps({
					index: this.clipIndex,
					name: this.name,
					frames: this.frames.length
				})
				this.commandQueue.push(command)
				this.state = Enums.TransferState.Finished
			}
		}
	}

	get transferId () {
		return this.frames[this.curFrame].transferId
	}

	gotLock () {
		this.state = Enums.TransferState.Locked
		this.start()
	}
}
