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
		if ((this.transfer === undefined || this.transfer.state === Enums.TransferState.Finished) && this.queue.length > 0) {
			this.transfer = this.queue.shift()

			if (this.state === 1) {
				this.lockObtained()
			} else {
				this._getLock()
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
		if (this.transfer && this.transfer.state !== Enums.TransferState.Finished) {
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
		if (this.transfer && this.transfer.state === Enums.TransferState.Finished) {
			this.transfer.resolvePromise(this.transfer)
		}

		if (this.queue.length > 0) {
			this.dequeueAndRun()
		} else { // unlock
			this._releaseLock()
		}
	}

	transferErrored (code: number) {
		if (this.transfer) {
			switch (code) {
				case 1: // Probably means "retry".
					if (this.transfer instanceof DataTransferClip) {
						// Retry the last frame.
						this.transfer.frames[this.transfer.curFrame].start()
					} else {
						// Retry the entire transfer.
						this.transfer.start()
					}
					break
				case 2: // Unknown.
				case 3: // Unknown.
				case 4: // Unknown.
				case 5: // Might mean "You don't have the lock"?
				default:
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

	_getLock () {
		const command = new Commands.LockStateCommand(this.storeId, true)
		this.commandQueue.push(command)
	}

	_releaseLock () {
		const command = new Commands.LockStateCommand(this.storeId, false)
		this.commandQueue.push(command)
	}
}
