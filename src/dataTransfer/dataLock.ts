import { Commands, Enums } from '..'

import DataTransfer from './dataTransfer'
import DataTransferClip from './dataTransferClip'

export default class DataLock {
	storeId: number
	state: number
	transfer: DataTransfer | undefined
	queue: Array<DataTransfer> = []

	commandQueue: Array<Commands.AbstractCommand> = []

	constructor (storeId: number, commandQueue: Array<Commands.AbstractCommand>) {
		this.storeId = storeId
		this.commandQueue = commandQueue
	}

	enqueue (transfer: DataTransfer) {
		this.queue.push(transfer)
		if (!this.transfer) {
			this.dequeueAndRun()
		}
	}

	dequeueAndRun () {
		if (this.transfer === undefined && this.queue.length > 0) {
			this.transfer = this.queue.shift()

			if (this.state === 1) {
				this.lockObtained()
			} else {
				// obtain lock
				const command = new Commands.LockStateCommand()
				command.updateProps({
					index: this.storeId,
					locked: true
				})

				this.commandQueue.push(command)
			}
		} else if (this.transfer) {
			this.transfer.fail(new Error('Tried to run next transfer, but one was still in-progress'))
		}
	}

	lockObtained () {
		this.state = 1
		if (this.transfer && this.transfer.state === Enums.TransferState.Queued) {
			this.transfer.gotLock()
		}
	}

	lostLock () {
		this.state = 0
		if (this.transfer && this.transfer.state === Enums.TransferState.Finished) {
			this.transfer.finish(this.transfer)
		} else if (this.transfer) {
			// @todo: dequeue any old commands
			this.transfer.fail(new Error('Lost lock mid-transfer'))
		}
		this.transfer = undefined
		this.dequeueAndRun()
	}

	updateLock (locked: boolean) {
		this.state = locked ? 1 : 0
	}

	transferFinished () {
		this.transfer = undefined
		if (this.queue.length > 0) {
			this.dequeueAndRun()
		} else { // unlock
			const command = new Commands.LockStateCommand()
			command.updateProps({
				index: this.storeId,
				locked: false
			})
			this.commandQueue.push(command)
		}
	}

	transferErrored (code: number) {
		if (this.transfer) {
			if (code === 1) {
				if (this.transfer instanceof DataTransferClip) {
					// Retry the last frame.
					this.transfer.frames[this.transfer.curFrame].start()
				} else {
					// Retry the entire transfer.
					this.transfer.start()
				}
			} else {
				// Abort the transfer.
				// @todo: dequeue any old commands
				this.transfer.fail(new Error(`Code ${code}`))
				this.transfer = undefined
				this.dequeueAndRun()
			}
		} else {
			this.transfer = undefined
			this.dequeueAndRun()
		}
	}
}
