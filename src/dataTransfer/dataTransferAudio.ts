import { Commands, Enums } from '..'

import DataTransferFrame from './dataTransferFrame'

export default class DataTransferAudio extends DataTransferFrame {
	description: { name: string }

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
		command.updateProps({ ...this.description, fileHash: this.hash, transferId: this.transferId })
		this.commandQueue.push(command)
	}
}
