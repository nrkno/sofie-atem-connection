import { ISerializableCommand } from '../commands/CommandBase'
import { DataTransferUploadBuffer } from './dataTransferUploadBuffer'
import { DataTransferFileDescriptionCommand, DataTransferUploadRequestCommand } from '../commands/DataTransfer'
import { ProgressTransferResult, DataTransferState } from './dataTransfer'

export default class DataTransferUploadAudio extends DataTransferUploadBuffer {
	readonly #clipIndex: number
	readonly #name: string

	constructor(clipIndex: number, data: Buffer, name: string) {
		super({
			encodedData: data,
			rawDataLength: data.length,
			hash: null,
		})

		this.#clipIndex = clipIndex
		this.#name = name
	}

	public async startTransfer(transferId: number): Promise<ProgressTransferResult> {
		const command = new DataTransferUploadRequestCommand({
			transferId: transferId,
			transferStoreId: this.#clipIndex + 1,
			transferIndex: 0,
			size: this.data.length,
			mode: 256,
		})

		return {
			newState: DataTransferState.Ready,
			commands: [command],
		}
	}

	protected generateDescriptionCommand(transferId: number): ISerializableCommand {
		return new DataTransferFileDescriptionCommand({
			name: this.#name,
			description: undefined,
			fileHash: this.hash,
			transferId: transferId,
		})
	}
}
