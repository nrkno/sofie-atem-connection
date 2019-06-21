import AbstractCommand from '../AbstractCommand'

export class DataTransferUploadContinueCommand extends AbstractCommand {
	rawName = 'FTCD'

	properties: {
		transferId: number,
		chunkSize: number,
		chunkCount: number
	}

	deserialize (rawCommand: Buffer) {
		this.properties = {
			transferId: rawCommand.readUInt16BE(0),
			chunkSize: rawCommand.readUInt16BE(6),
			chunkCount: rawCommand.readUInt16BE(8)
		}
	}
}
