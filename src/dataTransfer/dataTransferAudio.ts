import { Commands, Enums } from '..'

import DataTransferFrame from './dataTransferFrame'

export default class DataTransferAudio extends DataTransferFrame {
	public readonly name: string

	constructor (transferId: number, storeId: number, data: Buffer, name: string) {
		super(transferId, storeId, 0, data)

		this.name = name
	}

	public start () {
		const command = new Commands.DataTransferUploadRequestCommand({
			transferId: this.transferId,
			transferStoreId: this.storeId,
			transferIndex: 0,
			size: this.data.length,
			mode: Enums.TransferMode.WriteAudio
		})
		return [ command ]
	}

	public sendDescription (): Commands.ISerializableCommand {
		return new Commands.DataTransferFileDescriptionCommand({ name: this.name, fileHash: this.hash, transferId: this.transferId })
	}
}
