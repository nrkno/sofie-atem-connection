import { DeserializedCommand } from '../CommandBase'

export interface DataTransferUploadContinueProps {
	transferId: number
	chunkSize: number
	chunkCount: number
}

export class DataTransferUploadContinueCommand extends DeserializedCommand<DataTransferUploadContinueProps> {
	public static readonly rawName = 'FTCD'

	public static deserialize (rawCommand: Buffer) {
		const properties = {
			transferId: rawCommand.readUInt16BE(0),
			chunkSize: rawCommand.readUInt16BE(6),
			chunkCount: rawCommand.readUInt16BE(8)
		}

		return new DataTransferUploadContinueCommand(properties)
	}

	public applyToState (): string[] {
		// Nothing to do
		return []
	}
}
