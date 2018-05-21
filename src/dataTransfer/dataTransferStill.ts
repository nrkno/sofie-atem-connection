import { DataTransfer, TransferState } from './dataTransferBase'
import * as Commands from '../commands'
import { Enums } from '../'

export class DataTransferStill extends DataTransfer {
	processAtemCommand (command: Commands.AbstractCommand) {
		if (this.state === TransferState.LockRequested && command.constructor.name === 'LockObtainedCommand') {
			this.state = TransferState.Locked
			this._sendUploadRequest()
		} else if (this.state === TransferState.UploadRequested && command.constructor.name === 'DataTransferUploadContinueCommand') {
			this.state = TransferState.Transferring
			this._sendDescription()
			this.continueUpload(command.properties.chunkCount, command.properties.chunkSize)
		} else if (this.state === TransferState.Transferring) {
			if (command.constructor.name === 'DataTransferUploadContinueCommand') {
				this.continueUpload(command.properties.chunkCount, command.properties.chunkSize)
			} else if (command.constructor.name === 'DataTransferUploadCompleteCommand') {
				this._unlock()
			}
		}
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

	private _sendUploadRequest () {
		this.state = TransferState.UploadRequested
		const command = new Commands.DataTransferUploadRequestCommand()
		command.updateProps({
			transferId: this.index,
			transferStoreId: Enums.StoragePool.Stills,
			transferIndex: this.pool,
			size: this.data.length,
			mode: Enums.TransferMode.Write
		})
		this._sendCommand(command)
	}

	private _sendDescription () {
		const command = new Commands.DataTransferFileDescriptionCommand()
		command.updateProps({...this.description, fileHash: this._hash, transferId: this.index})
		this._sendCommand(command)
	}

	private _unlock () {
		const command = new Commands.LockStateCommand()
		command.updateProps({
			index: this.type,
			locked: false
		})
		this._sendCommand(command)
	}
}
