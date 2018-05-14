import { Enums, Commands } from './'
import AbstractCommand from './commands/AbstractCommand'

const TIMEOUT = 5000

export class DataTransferManager {
	private transfers: Array<DataTransfer>
	private dataTransferQueue: Array<AbstractCommand>
	private sendCommand: (command: AbstractCommand) => void
	private locks = [ false, false, false ]
	private lastTransferIndex = 0

	constructor () {
		setInterval(() => {
			if (this.dataTransferQueue.length > 0) {
				this.sendCommand(this.dataTransferQueue.shift()!)
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
				this.sendCommand(command)
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
		this.transfers.push(new DataTransfer(
			this.lastTransferIndex++,
			pool,
			type,
			description,
			data,
			this._queueCommand
		))

		if (this.locks[type] === false) {
			this._startNext()
		}

		return this.lastTransferIndex
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
				this.sendCommand(command)
				tranfer.transferring = true
				tranfer.lastSent = Date.now()
			}
		}
	}

	private _queueCommand (command: AbstractCommand) {
		this.dataTransferQueue.push(command)
	}

	private _releaseLock (type: number) {
		const command = new Commands.LockStateCommand()
		command.updateProps({
			index: type,
			locked: false
		})
		this.sendCommand(command)
	}

	private _getLock (type: number) {
		const command = new Commands.LockStateCommand()
		command.updateProps({
			index: type,
			locked: true
		})
		this.sendCommand(command)
	}

	private _failTransfer (transferId: number) {
		for (const transfer of this.transfers) {
			if (transfer.index === transferId) {
				this.transfers.splice(this.transfers.indexOf(transfer), 1)
				transfer.fail()
				this._releaseLock(transfer.type)
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
			const command = new Commands.DataTransferFileDescriptionCommand()
			command.updateProps({...this.description, hash: this._hash})
			this._queueCommand(command)
		}

		for (let i = 0; i < chunkCount; i++) {
			const command = new Commands.DataTransferDataCommand()
			command.updateProps({
				transferId: this.index,
				data: this.data.slice(this._sent, this._sent + chunkSize)
			})
			this._queueCommand(command)
			this._sent += chunkSize
		}
	}
}
