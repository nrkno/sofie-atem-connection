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

	serialize () {
		const buffer = Buffer.alloc(16)
		buffer.writeUInt16BE(this.properties.transferId, 0)
		buffer[2] = 26 // https://github.com/LibAtem/LibAtem/blob/master/LibAtem/Commands/DataTransfer/DataTransferUploadContinueCommand.cs#L13
		buffer.writeUInt16BE(this.properties.chunkSize, 6)
		buffer.writeUInt16BE(this.properties.chunkCount, 8)
		buffer[10] = 0x8b00

		return Buffer.concat([Buffer.from('FTCD', 'ascii'), buffer])
	}
}
