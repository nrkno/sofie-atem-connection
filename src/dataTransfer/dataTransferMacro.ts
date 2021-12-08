import {
	DataTransferAckCommand,
	DataTransferCompleteCommand,
	DataTransferDataCommand,
	DataTransferDownloadRequestCommand,
	DataTransferErrorCommand,
	DataTransferFileDescriptionCommand,
	DataTransferUploadRequestCommand,
	ErrorCode,
} from '../commands/DataTransfer'
import { IDeserializedCommand, ISerializableCommand } from '../commands/CommandBase'
import { DataTransfer, ProgressTransferResult, DataTransferState } from './dataTransfer'
import { DataTransferUploadBuffer } from './dataTransferUploadBuffer'

// TODO - this should be reimplemented on top of a generic DataTransferDownloadBuffer class
export class DataDownloadMacro extends DataTransfer<Buffer> {
	#data = Buffer.alloc(0)

	constructor(public readonly macroIndex: number) {
		super()
	}

	public async startTransfer(transferId: number): Promise<ProgressTransferResult> {
		const command = new DataTransferDownloadRequestCommand({
			transferId: transferId,
			transferStoreId: 0xffff,
			transferIndex: this.macroIndex,
			transferType: 3,
		})

		return {
			newState: DataTransferState.Ready,
			commands: [command],
		}
	}

	public async handleCommand(
		command: IDeserializedCommand,
		oldState: DataTransferState
	): Promise<ProgressTransferResult> {
		if (command instanceof DataTransferErrorCommand) {
			switch (command.properties.errorCode) {
				case ErrorCode.Retry:
					return this.restartTransfer(command.properties.transferId)

				case ErrorCode.NotFound:
					this.abort(new Error('Invalid download'))

					return {
						newState: DataTransferState.Finished,
						commands: [],
					}
				default:
					// Abort the transfer.
					this.abort(new Error(`Unknown error ${command.properties.errorCode}`))

					return {
						newState: DataTransferState.Finished,
						commands: [],
					}
			}
		} else if (command instanceof DataTransferDataCommand) {
			this.#data = command.properties.body

			// todo - have we received all data? maybe check if the command.body < max_len

			return {
				newState: oldState,
				commands: [
					new DataTransferAckCommand({
						transferId: command.properties.transferId,
						transferIndex: this.macroIndex,
					}),
				],
			}
		} else if (command instanceof DataTransferCompleteCommand) {
			this.resolvePromise(this.#data)

			return {
				newState: DataTransferState.Finished,
				commands: [],
			}
		}

		return { newState: oldState, commands: [] }
	}
}

export class DataUploadMacro extends DataTransferUploadBuffer {
	constructor(public readonly macroIndex: number, public readonly data: Buffer, private name: string) {
		super(data)
	}

	public async startTransfer(transferId: number): Promise<ProgressTransferResult> {
		const command = new DataTransferUploadRequestCommand({
			transferId: transferId,
			transferStoreId: 0xffff,
			transferIndex: this.macroIndex,
			size: this.data.length,
			mode: 768,
		})

		return {
			newState: DataTransferState.Ready,
			commands: [command],
		}
	}

	protected generateDescriptionCommand(transferId: number): ISerializableCommand {
		return new DataTransferFileDescriptionCommand({
			name: this.name,
			description: undefined,
			fileHash: '',
			transferId: transferId,
		})
	}
}
