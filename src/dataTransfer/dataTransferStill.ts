import { Commands } from '..'

import DataTransferFrame from './dataTransferFrame'

export default class DataTransferStill extends DataTransferFrame {
	private readonly name: string
	private readonly description: string

	constructor (transferId: number, frameId: number, data: Buffer, name: string, description: string) {
		super(transferId, 0, frameId, data)

		this.name = name
		this.description = description
	}

	public sendDescription (): Commands.ISerializableCommand {
		return new Commands.DataTransferFileDescriptionCommand({ description: this.description, name: this.name, fileHash: this.hash, transferId: this.transferId })
	}
}
