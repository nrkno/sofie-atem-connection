import { ISerializableCommand } from '../commands/CommandBase'
import { DataTransferUploadBuffer } from './dataTransferUploadBuffer'
import { DataTransferFileDescriptionCommand, DataTransferUploadRequestCommand } from '../commands/DataTransfer'
import { ProgressTransferResult, DataTransferState } from './dataTransfer'

export default class DataTransferUploadMultiViewerLabel extends DataTransferUploadBuffer {
	readonly #sourceId: number

	constructor(sourceId: number, data: Buffer) {
		super({
			encodedData: data,
			rawDataLength: data.length,
			hash: null,
		})

		this.#sourceId = sourceId
	}

	public async startTransfer(transferId: number): Promise<ProgressTransferResult> {
		const command = new DataTransferUploadRequestCommand({
			transferId: transferId,
			transferStoreId: 0xffff,
			transferIndex: this.#sourceId,
			size: this.data.length,
			mode: 0x0201,
		})

		return {
			newState: DataTransferState.Ready,
			commands: [command],
		}
	}

	protected generateDescriptionCommand(transferId: number): ISerializableCommand {
		return new DataTransferFileDescriptionCommand({
			description: '',
			name: 'Label',
			fileHash: this.hash,
			transferId: transferId,
		})
	}
}
