import { Commands, Enums } from '..'

import DataTransferFrame from './dataTransferFrame'

export default class DataTransferAudio extends DataTransferFrame {
	readonly name: string

	constructor (transferId: number, storeId: number, data: Buffer, name: string) {
		super(transferId, storeId, 0, data)

		this.name = name
	}

	start () {
		const command = new Commands.DataTransferUploadRequestCommand()
		command.updateProps({
			transferId: this.transferId,
			transferStoreId: this.storeId,
			transferIndex: 0,
			size: this.data.length,
			mode: Enums.TransferMode.WriteAudio
		})
		this.commandQueue.push(command)
	}

	sendDescription () {
		const command = new Commands.DataTransferFileDescriptionCommand()
		command.updateProps({ name: this.name, fileHash: this.hash, transferId: this.transferId })
		this.commandQueue.push(command)
	}
}
