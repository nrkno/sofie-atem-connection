import { Commands, Enums } from '..'

import DataTransfer from './dataTransfer'

/**
 * Macros don't have a lock so this is just a queue with the API of a lock.
 */
export default class MacroLock {
	private taskQueue: Array<DataTransfer> = []

	public activeTransfer: DataTransfer | undefined

	private queueCommand: (cmd: Commands.ISerializableCommand) => void

	constructor(queueCommand: (cmd: Commands.ISerializableCommand) => void) {
		this.queueCommand = queueCommand
	}

	public enqueue(transfer: DataTransfer): Promise<DataTransfer> {
		this.taskQueue.push(transfer)
		if (!this.activeTransfer || this.activeTransfer.state === Enums.TransferState.Finished) {
			this.dequeueAndRun()
		}

		return transfer.promise
	}

	private dequeueAndRun(): void {
		if (
			(this.activeTransfer === undefined || this.activeTransfer.state === Enums.TransferState.Finished) &&
			this.taskQueue.length > 0
		) {
            this.activeTransfer = this.taskQueue.shift()
            this.activeTransfer?.gotLock().forEach((cmd) => this.queueCommand(cmd))
		}
	}

	public lockObtained(): void {
		// I don't know what this means, let's hope it never happens
	}

	public lostLock(): void {
		// can't lose a lock if you don't have a lock
	}

	public updateLock(): void {
		//
	}

	public transferFinished(): void {
		// great, no need to do anything, the transfer will have ack'ed already
	}

	public transferErrored(code: number): void {
		if (this.activeTransfer) {
			switch (code) {
				case 1: // Probably means "retry".
                    this.activeTransfer.start().forEach((cmd) => this.queueCommand(cmd))
					break
				case 2: // Unknown: looks like macro not found
				case 3: // Unknown.
				case 4: // Unknown.
				case 5: // Might mean "You don't have the lock"?
				default:
					// Abort the transfer.
					// @todo: dequeue any old commands
					this.activeTransfer.rejectPromise(new Error(`Code ${code}`))
					this.activeTransfer = undefined
					this.dequeueAndRun()
			}
		} else {
			this.activeTransfer = undefined
			this.dequeueAndRun()
		}
	}
}
