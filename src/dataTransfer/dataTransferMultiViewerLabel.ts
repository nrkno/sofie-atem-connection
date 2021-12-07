import { Commands } from '..'

import DataTransferFrame from './dataTransferFrame'

export default class DataTransferMultiViewerLabel extends DataTransferFrame {
	constructor(transferId: number, frameId: number, data: Buffer) {
		super(transferId, 0xffff, frameId, data)
	}

	public async start(): Promise<Commands.ISerializableCommand[]> {
		const command = new Commands.DataTransferUploadRequestCommand({
			transferId: this.transferId,
			transferStoreId: this.storeId,
			transferIndex: this.frameId,
			size: this.data.length,
			mode: 0x0201,
		})
		return [command]
	}

	public sendDescription(): Commands.ISerializableCommand {
		return new Commands.DataTransferFileDescriptionCommand({
			description: '',
			name: 'Label',
			fileHash: this.hash,
			transferId: this.transferId,
		})
	}
}
