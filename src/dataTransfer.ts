import { Enums, Commands } from './'
import AbstractCommand from './commands/AbstractCommand'

const TIMEOUT = 5000

export interface DataTransferProperties {
	type: Enums.StoragePool
	pool: number,
	name: string
	description: string
	data: Buffer
}

export class DataTransferManager {
	transfers: Array<DataTransfer> = []
	locks = [ false, false, false ]
	private _dataTransferQueue: Array<AbstractCommand> = []
	private _sendCommand: (command: AbstractCommand) => void
	private lastTransferIndex = 0

	constructor (sendCommand: (command: AbstractCommand) => void) {
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
		if (command.constructor.name === 'LockObtainedCommand') {
			if (this.transfers.length === 0) {
				const command = new Commands.LockStateCommand()
				command.updateProps({
					index: command.properties.index,
					locked: false
				})
				this._sendCommand(command)
			} else {
				this._proceedNext()
			}
		} else if (command.constructor.name === 'LockStateCommand') {
			this.locks[command.properties.index] = command.properties.locked
		} else if (command.constructor.name === 'DataTransferUploadContinueCommand') {
			for (const transfer of this.transfers) {
				if (transfer.index === command.properties.transferId) {
					transfer.continueUpload(command.properties.chunkCount, command.properties.chunkSize)
				}
			}
		} else if (command.constructor.name === 'DataTransferCompleteCommand') {
			this._finishTransfer(command.properties.transferId)
		} else if (command.constructor.name === 'DataTransferErrorCommand') {
			this._failTransfer(command.properties.transferId)
		}
	}

	newTransfer (type: Enums.StoragePool, pool: number, description: { name: string, description: string }, data: Buffer) {
		const transfer = new DataTransfer(
			this.lastTransferIndex++,
			pool,
			type,
			description,
			data,
			(command: AbstractCommand) => this._dataTransferQueue.push(command)
		)
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
		for (const tranfer of this.transfers) {
			if (tranfer.transferring === false && this.locks[tranfer.type] === false) {
				this._getLock(tranfer.type)
				break
			}
		}
	}

	private _proceedNext () {
		for (const tranfer of this.transfers) {
			if (tranfer.transferring === false && this.locks[tranfer.type] === false) {
				const command = new Commands.DataTransferUploadRequestCommand()
				command.updateProps({
					transferId: tranfer.index,
					transferStoreId: tranfer.type,
					transferIndex: tranfer.pool,
					size: tranfer.data.length,
					mode: tranfer.type === Enums.StoragePool.Sounds ? Enums.TransferMode.WriteAudio : Enums.TransferMode.Write
				})
				this._sendCommand(command)
				tranfer.transferring = true
				tranfer.lastSent = Date.now()
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

	private _getLock (type: number) {
		const command = new Commands.LockStateCommand()
		command.updateProps({
			index: type,
			locked: true
		})
		this._sendCommand(command)
	}

	private _failTransfer (transferId: number) {
		for (const transfer of this.transfers) {
			if (transfer.index === transferId) {
				this.transfers.splice(this.transfers.indexOf(transfer), 1)
				transfer.fail()
				this._releaseLock(transfer.type)
			}
		}
		for (const i in this._dataTransferQueue) {
			const command = this._dataTransferQueue[i]
			if (command.properties.transferId && command.properties.transferId === transferId) {
				this._dataTransferQueue.splice(Number(i), 1)
				if (command.reject) command.reject(command)
			}
		}
		this._startNext()
	}

	private _finishTransfer (transferId: number) {
		for (const transfer of this.transfers) {
			if (transfer.index === transferId) {
				this.transfers.splice(this.transfers.indexOf(transfer), 1)
				transfer.transferring = false
				transfer.finish()
				this._releaseLock(transfer.type)
			}
		}
		this._startNext()
	}
}

export class DataTransfer {
	readonly index: number

	transferring = false
	lastSent: number
	pool: number
	description: {
		name: string,
		description: string
	}
	data: Buffer
	type: Enums.StoragePool
	finish: () => void
	fail: () => void

	private _hash: string
	private _queueCommand: (command: AbstractCommand) => void
	private _sent = 0
	private _sentDesc = false

	constructor (
		index: number,
		pool: number,
		type: Enums.StoragePool,
		description: {
			name: string,
			description: string
		},
		data: Buffer,
		queueCommand: (command: AbstractCommand) => void
	) {
		this.index = index
		this.pool = pool
		this.type = type
		this.description = description
		this.data = data
		this._hash = Math.random().toString(36).substring(7) // @todo: create hash from data
		this._queueCommand = queueCommand
	}

	continueUpload (chunkCount: number, chunkSize: number) {
		chunkSize += -4
		this.lastSent = Date.now()

		if (!this._sentDesc) {
			this._sentDesc = true
			const command = new Commands.DataTransferFileDescriptionCommand()
			command.updateProps({...this.description, fileHash: this._hash, transferId: this.index})
			this._queueCommand(command)
		}

		for (let i = 0; i < chunkCount; i++) {
			if (this._sent > this.data.length) return
			const command = new Commands.DataTransferDataCommand()
			command.updateProps({
				transferId: this.index,
				body: this.data.slice(this._sent, this._sent + chunkSize)
			})
			this._queueCommand(command)
			this._sent += chunkSize
		}
	}
}
