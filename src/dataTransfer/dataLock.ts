import { Commands, Enums } from '..'

import DataTransfer from './dataTransfer'

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
		this.dequeueAndRun()
	}

	dequeueAndRun () {
		if (this.transfer === undefined && this.queue.length > 0) {
			this.transfer = this.queue.shift()
			// obtain lock
			const command = new Commands.LockStateCommand()
			command.updateProps({
				index: this.storeId,
				locked: true
			})
			this.commandQueue.push(command)
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
			this.transfer.fail()
		}
		this.transfer = undefined
		this.dequeueAndRun()
	}

	updateLock (locked: boolean) {
		this.state = locked ? 1 : 0
	}

	transferFinished () {
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
}
