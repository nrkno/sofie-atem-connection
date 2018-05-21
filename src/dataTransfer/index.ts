import { Enums, Commands } from '../'
import AbstractCommand from '../commands/AbstractCommand'

import { DataTransfer } from './dataTransferBase'
import { DataTransferStill } from './dataTransferStill'
import { DataTransferClip, DataTransferFrame } from './dataTransferClip'

const TIMEOUT = 5000

export interface DataTransferProperties {
	type: Enums.StoragePool
	pool: number,
	name: string
	description: string
	data: Buffer
}

export enum TransferState {
	Queued,
	LockRequested,
	Locked,
	Transferring,
	Finished
}

export class DataTransferManager {
	transfers: Array<DataTransfer> = []
	locks = [ false, false, false ]
	private _dataTransferQueue: Array<AbstractCommand> = []
	private _sendCommand: (command: AbstractCommand) => Promise<Commands.AbstractCommand>
	private lastTransferIndex = 0

	constructor (sendCommand: (command: AbstractCommand) => Promise<Commands.AbstractCommand>) {
		this._sendCommand = sendCommand
		setInterval(() => {
			if (this._dataTransferQueue.length > 0) {
				this._sendCommand(this._dataTransferQueue.shift()!)
			}
			const now = Date.now()
			for (const transfer of this.transfers) {
				if (transfer.transferring && now - transfer.lastSent > TIMEOUT) {
					this._failTransfer(transfer.index) // @todo: we should probably notify timeout, rather than normal fail
				}
			}
		}, 0)
	}

	processAtemCommand (command: AbstractCommand) {
		for (let i = 0; i < 3; i++) {
			this.transfers[i].processAtemCommand(command)
		}

		if (command.constructor.name === 'LockObtainedCommand') {
			if (this.transfers.length === 0) {
				const command = new Commands.LockStateCommand()
				command.updateProps({
					index: command.properties.index,
					locked: false
				})
				this._sendCommand(command)
			}
		} else if (command.constructor.name === 'LockStateCommand') {
			this.locks[command.properties.index] = command.properties.locked
		}
	}

	uploadStill (type = Enums.StoragePool.Stills, pool: number, description: { name: string, description: string }, data: Buffer) {
		const transfer = new DataTransferStill(
			this.lastTransferIndex++,
			pool,
			type,
			description,
			(command: AbstractCommand) => this._dataTransferQueue.push(command),
			(command: AbstractCommand) => this._sendCommand(command)
		)
		transfer.data = data
		const ps = new Promise((resolve, reject) => {
			transfer.finish = resolve
			transfer.fail = reject
		}).then(() => {
			this._removeFromTransfers(transfer.index)
		})
		this.transfers.push(transfer)

		if (this.locks[type] === false) {
			this._startNext()
		}

		return ps
	}

	uploadClip (type: Enums.StoragePool, description: { name: string, description: string }, data: Array<Buffer>) {
		const transfer = new DataTransferClip(
			this.lastTransferIndex++,
			type,
			description,
			(command: AbstractCommand) => this._dataTransferQueue.push(command),
			(command: AbstractCommand) => this._sendCommand(command)
		)

		for (const frameIndex in data) {
			const frameTransfer = new DataTransferFrame(
				this.lastTransferIndex++,
				type,
				Number(frameIndex),
				description,
				(command: AbstractCommand) => this._dataTransferQueue.push(command),
				(command: AbstractCommand) => this._sendCommand(command)
			)
			frameTransfer.data = data[frameIndex]
			transfer.frames.push(frameTransfer)
		}

		const ps = new Promise((resolve, reject) => {
			transfer.finish = resolve
			transfer.fail = reject
		})
		this.transfers.push(transfer)

		if (this.locks[type] === false) {
			this._startNext()
		}

		return ps
	}

	cancelTransfer (transferId: number) {
		this._failTransfer(transferId)
	}

	private _startNext () {
		for (const transfer of this.transfers) {
			if (transfer.transferring === false && this.locks[transfer.type] === false) {
				transfer.start()
				break
			}
		}
	}

	private _releaseLock (type: number) {
		const command = new Commands.LockStateCommand()
		command.updateProps({
			index: type,
			locked: false
		})
		this._sendCommand(command)
	}

	private _failTransfer (transferId: number) {
		const transfer = this._removeFromTransfers(transferId)
		if (transfer) transfer.fail()
		for (const i in this._dataTransferQueue) {
			const command = this._dataTransferQueue[i]
			if (command.properties.transferId && command.properties.transferId === transferId) {
				this._dataTransferQueue.splice(Number(i), 1)
				if (command.reject) command.reject(command)
			}
		}
		this._startNext()
	}

	private _removeFromTransfers (transferId: number): DataTransfer | undefined {
		for (const transfer of this.transfers) {
			if (transfer.index === transferId) {
				this.transfers.splice(this.transfers.indexOf(transfer), 1)
				return transfer
			}
		}
		return
	}
}
