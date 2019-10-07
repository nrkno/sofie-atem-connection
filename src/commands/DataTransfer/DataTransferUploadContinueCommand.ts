import AbstractCommand from '../AbstractCommand'

export class DataTransferUploadContinueCommand extends AbstractCommand {
	static readonly rawName = 'FTCD'

	readonly properties: Readonly<{
		transferId: number,
		chunkSize: number,
		chunkCount: number
	}>

	constructor (properties: DataTransferUploadContinueCommand['properties']) {
		super()

		this.properties = properties
	}

	static deserialize (rawCommand: Buffer) {
		const properties = {
			transferId: rawCommand.readUInt16BE(0),
			chunkSize: rawCommand.readUInt16BE(6),
			chunkCount: rawCommand.readUInt16BE(8)
		}

		return new DataTransferUploadContinueCommand(properties)
	}
}
