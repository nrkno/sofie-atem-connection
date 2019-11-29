import { Commands, Enums } from '..'
import * as crypto from 'crypto'

import DataTransfer from './dataTransfer'

export default class DataTransferFrame extends DataTransfer {
	readonly frameId: number
	readonly hash: string
	readonly data: Buffer

	lastSent?: Date
	_sent = 0

	constructor (transferId: number, storeId: number, frameId: number, data: Buffer) {
		super(transferId, storeId)

		this.frameId = frameId
		this.data = data
		this.hash = this.data ? crypto.createHash('md5').update(this.data).digest().toString() : ''
	}

	public start () {
		const command = new Commands.DataTransferUploadRequestCommand({
			transferId: this.transferId,
			transferStoreId: this.storeId,
			transferIndex: this.frameId,
			size: this.data.length,
			mode: Enums.TransferMode.Write
		})
		return [ command ]
	}

	public sendDescription (): Commands.ISerializableCommand {
		return new Commands.DataTransferFileDescriptionCommand({ fileHash: this.hash, transferId: this.transferId })
	}

	public handleCommand (command: Commands.IDeserializedCommand): Commands.ISerializableCommand[] {
		const commands: Commands.ISerializableCommand[] = []
		if (command.constructor.name === Commands.DataTransferUploadContinueCommand.name) {
			if (this.state === Enums.TransferState.Locked) {
				this.state = Enums.TransferState.Transferring
				commands.push(this.sendDescription())
			}
			commands.push(...this.queueCommand(command.properties.chunkCount, command.properties.chunkSize))
		} else if (command.constructor.name === Commands.DataTransferCompleteCommand.name) {
			if (this.state === Enums.TransferState.Transferring) {
				this.state = Enums.TransferState.Finished
			}
		}

		return commands
	}

	public gotLock () {
		this.state = Enums.TransferState.Locked
		return this.start()
	}

	private queueCommand (chunkCount: number, chunkSize: number): Commands.ISerializableCommand[] {
		const commands: Commands.ISerializableCommand[] = []

		chunkSize += -4
		this.lastSent = new Date()

		for (let i = 0; i < chunkCount; i++) {
			if (this._sent > this.data.length) break
			const command = new Commands.DataTransferDataCommand({
				transferId: this.transferId,
				body: this.data.slice(this._sent, this._sent + chunkSize)
			})
			commands.push(command)
			this._sent += chunkSize
		}

		return commands
	}
}
