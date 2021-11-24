import { Commands, Enums } from '..'

import DataTransfer from './dataTransfer'
import DataTransferClip from './dataTransferClip'

export default class DataLock {
	private storeId: number
	private isLocked: boolean
	private taskQueue: Array<DataTransfer> = []

	public activeTransfer: DataTransfer | undefined

	private queueCommand: (cmd: Commands.ISerializableCommand) => void

	constructor(storeId: number, queueCommand: (cmd: Commands.ISerializableCommand) => void) {
		this.storeId = storeId
		this.queueCommand = queueCommand
		this.isLocked = false
	}

	public enqueue(transfer: DataTransfer): Promise<DataTransfer> {
		this.taskQueue.push(transfer)
		if (!this.activeTransfer) {
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

			if (this.isLocked) {
				// TODO - this flow should never be hit
				this.lockObtained().catch((e) => {
					// TODO - handle this better. it should kill/restart the upload. and should also be logged in some way
					console.error(`Error after obtaining lock: ${e}`)
				})
			} else {
				this.queueCommand(new Commands.LockStateCommand(this.storeId, true))
			}
		}
	}

	public async lockObtained(): Promise<void> {
		this.isLocked = true
		if (this.activeTransfer && this.activeTransfer.state === Enums.TransferState.Queued) {
			const cmds = await this.activeTransfer.gotLock()
			cmds.forEach((cmd) => this.queueCommand(cmd))
		}
	}

	public lostLock(): void {
		this.isLocked = false
		if (this.activeTransfer) {
			if (this.activeTransfer.state === Enums.TransferState.Finished) {
				this.activeTransfer.resolvePromise(this.activeTransfer)
			} else {
				// @todo: dequeue any old commands
				this.activeTransfer.rejectPromise(new Error('Lost lock mid-transfer'))
			}
		}

		this.activeTransfer = undefined
		this.dequeueAndRun()
	}

	public updateLock(locked: boolean): void {
		this.isLocked = locked
	}

	public transferFinished(): void {
		this.queueCommand(new Commands.LockStateCommand(this.storeId, false))
	}

	public async transferErrored(code: number): Promise<void> {
		if (this.activeTransfer) {
			switch (code) {
				case 1: // Probably means "retry".
					if (this.activeTransfer instanceof DataTransferClip) {
						// Retry the last frame.
						if (this.activeTransfer.curFrame) {
							;(await this.activeTransfer.curFrame.start()).forEach((cmd) => this.queueCommand(cmd))
						}
					} else {
						// Retry the entire transfer.
						const cmds = await this.activeTransfer.start()
						cmds.forEach((cmd) => this.queueCommand(cmd))
					}
					break
				case 2: // Unknown.
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
