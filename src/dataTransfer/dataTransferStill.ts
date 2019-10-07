import { Commands } from '..'

import DataTransferFrame from './dataTransferFrame'

export default class DataTransferStill extends DataTransferFrame {
	readonly name: string
	readonly description: string

	constructor (transferId: number, frameId: number, data: Buffer, name: string, description: string) {
		super(transferId, 0xffff, frameId, data)

		this.name = name
		this.description = description
	}

	sendDescription () {
		const command = new Commands.DataTransferFileDescriptionCommand()
		command.updateProps({ description: this.description, name: this.name, fileHash: this.hash, transferId: this.transferId })
		this.commandQueue.push(command)
	}
}
