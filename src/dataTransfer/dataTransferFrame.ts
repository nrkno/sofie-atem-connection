import { Commands, Enums } from '..'
import * as crypto from 'crypto'

import DataTransfer from './dataTransfer'

export default class DataTransferFrame extends DataTransfer {
	frameId: number
	hash: string

	lastSent: Date
	data: Buffer
	_sent = 0

	start () {
		const command = new Commands.DataTransferUploadRequestCommand()
		command.updateProps({
			transferId: this.transferId,
			transferStoreId: this.storeId,
			transferIndex: this.frameId,
			size: this.data.length,
			mode: Enums.TransferMode.Write
		})
		this.commandQueue.push(command)
	}

	sendDescription () {
		if (!this.hash) {
			this.setHash()
		}
		const command = new Commands.DataTransferFileDescriptionCommand()
		command.updateProps({ fileHash: this.hash, transferId: this.transferId })
		this.commandQueue.push(command)
	}

	handleCommand (command: Commands.AbstractCommand) {
		if (command.constructor.name === Commands.DataTransferUploadContinueCommand.name) {
			if (this.state === Enums.TransferState.Locked) {
				this.state = Enums.TransferState.Transferring
				this.sendDescription()
			}
			this.queueCommand(command.properties.chunkCount, command.properties.chunkSize)
		} else if (command.constructor.name === Commands.DataTransferCompleteCommand.name) {
			if (this.state === Enums.TransferState.Transferring) {
				this.state = Enums.TransferState.Finished
			}
		}
	}

	gotLock () {
		this.state = Enums.TransferState.Locked
		this.start()
	}

	queueCommand (chunkCount: number, chunkSize: number) {
		chunkSize += -4
		this.lastSent = new Date()

		for (let i = 0; i < chunkCount; i++) {
			if (this._sent > this.data.length) return
			const command = new Commands.DataTransferDataCommand()
			command.updateProps({
				transferId: this.transferId,
				body: this.data.slice(this._sent, this._sent + chunkSize)
			})
			this.commandQueue.push(command)
			this._sent += chunkSize
		}
	}

	setHash () {
		if (this.data) {
			this.hash = crypto.createHash('md5').update(this.data).digest().toString()
		}
	}
}
