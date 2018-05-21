import { DataTransfer, TransferState } from './dataTransferBase'
import * as Commands from '../commands'
import { Enums } from '../'

export class DataTransferClip extends DataTransfer {
	frames: Array<DataTransferFrame> = []
	finished: Array<DataTransferFrame> = []
	curFrame: DataTransferFrame

	constructor (
		index: number,
		type: Enums.StoragePool,
		description: {
			name: string,
			description: string
		},
		queueCommand: (command: Commands.AbstractCommand) => void,
		sendCommand: (command: Commands.AbstractCommand) => Promise<Commands.AbstractCommand>
	) {
		super (
			index,
			0,
			type,
			description,
			queueCommand,
			sendCommand
		)
	}

	processAtemCommand (command: Commands.AbstractCommand) {
		if (this.state === TransferState.LockRequested && command.constructor.name === 'LockObtainedCommand' && command.properties.index === this.type) {
			this.state = TransferState.Locked
			this._clearClip()
			this._nextFrame()
		} else if (this.state === TransferState.UploadRequested && command.constructor.name === 'DataTransferUploadContinueCommand' && command.properties.transferId === this.curFrame.index) {
			this.state = TransferState.Transferring
			this.curFrame._sendDescription()
			this.curFrame.continueUpload(command.properties.chunkCount, command.properties.chunkSize)
		} else if (this.state === TransferState.Transferring && command.properties.curFrame.transferId === this.index) {
			if (command.constructor.name === 'DataTransferUploadContinueCommand') {
				this.curFrame.continueUpload(command.properties.chunkCount, command.properties.chunkSize)
			} else if (command.constructor.name === 'DataTransferUploadCompleteCommand') {
				this._nextFrame()
			}
		}
	}

	continueUpload () {
		// implememnted by DataTransferFrame
	}

	private _clearClip () {
		const command = new Commands.MediaPoolClearClipCommand()
		command.updateProps({
			index: 0
		})
		this._sendCommand(command)
	}

	private _nextFrame () {
		if (typeof this.curFrame === 'undefined') this.finished.push(this.curFrame)
		if (this.frames.length > 0) {
			this.curFrame = this.frames.shift()!
			this._sendUploadRequest()
		} else {
			this._sendDescription()
		}
	}

	private _sendUploadRequest () {
		this.state = TransferState.UploadRequested
		const command = new Commands.DataTransferUploadRequestCommand()
		command.updateProps({
			transferId: this.curFrame.index,
			transferStoreId: this.type,
			transferIndex: this.curFrame.pool,
			size: this.curFrame.data.length,
			mode: Enums.TransferMode.Write
		})
		this._sendCommand(command)
	}

	private _sendDescription () {
		const command = new Commands.MediaPoolSetClipCommand()
		command.updateProps({
			index: 0,
			name: this.description.name,
			frames: this.finished.length
		})
		this._sendCommand(command).then(() => {
			this._unlock()
		})
	}

	private _unlock () {
		this.state = TransferState.Finished
		const command = new Commands.LockStateCommand()
		command.updateProps({
			index: this.type,
			locked: false
		})
		this._sendCommand(command).then(() => {
			this.finish()
		})
	}
}

export class DataTransferFrame extends DataTransfer {
	processAtemCommand () {
		// parent class handles this.
	}

	continueUpload (chunkCount: number, chunkSize: number) {
		chunkSize += -4
		this.lastSent = Date.now()

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

	_sendDescription () {
		const command = new Commands.DataTransferFileDescriptionCommand()
		command.updateProps({ fileHash: this._hash, transferId: this.index })
		this._sendCommand(command)
	}
}
