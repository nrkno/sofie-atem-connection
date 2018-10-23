import { Commands } from '..'

import DataTransferFrame from './dataTransferFrame'

export default class DataTransferStill extends DataTransferFrame {
	description: { name: string, description: string }

	sendDescription () {
		const command = new Commands.DataTransferFileDescriptionCommand()
		command.updateProps({ ...this.description, fileHash: this.hash, transferId: this.transferId })
		this.commandQueue.push(command)
	}
}
