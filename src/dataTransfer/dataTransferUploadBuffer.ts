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
import debug0 = require('debug')
import * as Util from '../lib/atemUtil'

const debug = debug0('atem-connection:data-transfer:upload-buffer')

export interface UploadBufferInfo {
	encodedData: Buffer
	rawDataLength: number
	hash: string | null
}

export function generateHashForBuffer(data: Buffer): string {
	return data ? crypto.createHash('md5').update(data).digest('base64') : ''
}

export function generateBufferInfo(data: Buffer, shouldEncodeRLE: boolean): UploadBufferInfo {
	return {
		encodedData: shouldEncodeRLE ? Util.encodeRLE(data) : data,
		rawDataLength: data.length,
		hash: generateHashForBuffer(data),
	}
}

export abstract class DataTransferUploadBuffer extends DataTransfer<void> {
	protected readonly hash: string
	protected readonly data: Buffer

	#bytesSent = 0

	constructor(buffer: UploadBufferInfo) {
		super()

		this.hash = buffer.hash ?? generateHashForBuffer(buffer.encodedData)
		this.data = buffer.encodedData
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

			// if (nextChunks.length === 0) this.abort(new Error('Ran out of data'))

			return result
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
		// const chunkSize = props.chunkSize - 4
		const chunkSize = Math.floor(props.chunkSize / 8) * 8

		for (let i = 0; i < props.chunkCount; i++) {
			// Make sure the packet isn't empty
			if (this.#bytesSent >= this.data.length) break

			// Make sure the packet doesn't end in the middle of a RLE block
			let shortenBy = 0
			if (chunkSize + this.#bytesSent > this.data.length) {
				// The last chunk can't end with a RLE header
				shortenBy = this.#bytesSent + chunkSize - this.data.length
			} else if (Util.RLE_HEADER === this.data.readBigUint64BE(this.#bytesSent + chunkSize - 8)) {
				// RLE header starts 8 bytes before the end
				shortenBy = 8
			} else if (Util.RLE_HEADER === this.data.readBigUint64BE(this.#bytesSent + chunkSize - 16)) {
				// RLE header starts 16 bytes before the end
				shortenBy = 16
			}

			commands.push(
				new DataTransferDataCommand({
					transferId: props.transferId,
					body: this.data.slice(this.#bytesSent, this.#bytesSent + chunkSize - shortenBy),
				})
			)
			this.#bytesSent += chunkSize - shortenBy
		}

		debug(`Generated ${commands.length} chunks for size ${chunkSize}`)

		return commands
	}
}
