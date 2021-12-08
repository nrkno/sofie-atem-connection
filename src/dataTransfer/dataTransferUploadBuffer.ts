import { IDeserializedCommand, ISerializableCommand } from '../commands/CommandBase'
import {
	DataTransferCompleteCommand,
	DataTransferDataCommand,
	DataTransferErrorCommand,
	DataTransferUploadContinueCommand,
	DataTransferUploadContinueProps,
	ErrorCode,
} from '../commands/DataTransfer'
import * as crypto from 'crypto'
import { DataTransfer, ProgressTransferResult, DataTransferState } from './dataTransfer'

export abstract class DataTransferUploadBuffer extends DataTransfer<void> {
	protected readonly hash: string
	protected readonly data: Buffer

	#bytesSent = 0

	constructor(data: Buffer) {
		super()

		this.data = data
		this.hash = this.data ? crypto.createHash('md5').update(this.data).digest().toString() : ''
	}

	protected abstract generateDescriptionCommand(transferId: number): ISerializableCommand

	public async handleCommand(
		command: IDeserializedCommand,
		oldState: DataTransferState
	): Promise<ProgressTransferResult> {
		if (command instanceof DataTransferErrorCommand) {
			switch (command.properties.errorCode) {
				case ErrorCode.Retry:
					return this.restartTransfer(command.properties.transferId)

				case ErrorCode.NotFound:
					this.abort(new Error('Invalid upload'))

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
		} else if (command instanceof DataTransferUploadContinueCommand) {
			const result: ProgressTransferResult = {
				newState: oldState,
				commands: [],
			}

			// Atem requested more packets of data
			if (oldState === DataTransferState.Ready) {
				// First bunch of packets, also send the description
				result.newState = DataTransferState.Transferring
				result.commands.push(this.generateDescriptionCommand(command.properties.transferId))
			}

			const nextChunks = this.getNextChunks(command.properties)
			result.commands.push(...nextChunks)

			return result

			// TODO - should we abort if there is no more data, as it suggests something got corrupt/lost?
		} else if (command instanceof DataTransferCompleteCommand) {
			// Atem reports that it recieved everything
			if (oldState === DataTransferState.Transferring) {
				this.resolvePromise()

				return {
					newState: DataTransferState.Finished,
					commands: [],
				}
			} else {
				return { newState: oldState, commands: [] }
			}
		} else {
			// Unknown command
			return { newState: oldState, commands: [] }
		}
	}

	private getNextChunks(props: DataTransferUploadContinueProps): ISerializableCommand[] {
		const commands: ISerializableCommand[] = []

		// Take a little less because the atem does that?
		const chunkSize = props.chunkSize - 4

		for (let i = 0; i < props.chunkCount; i++) {
			// Make sure we don't end up with an empty slice
			if (this.#bytesSent >= this.data.length) break

			commands.push(
				new DataTransferDataCommand({
					transferId: props.transferId,
					body: this.data.slice(this.#bytesSent, this.#bytesSent + chunkSize),
				})
			)
			this.#bytesSent += chunkSize
		}

		return commands
	}
}
