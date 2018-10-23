import AbstractCommand from '../AbstractCommand'

export class DataTransferErrorCommand extends AbstractCommand {
	rawName = 'FTDE'

	properties: {
		transferId: number,
		errorCode: number
	}

	deserialize (rawCommand: Buffer) {
		this.properties = {
			transferId: rawCommand.readUInt16BE(0),
			errorCode: rawCommand.readUInt8(2)
		}
	}
}
