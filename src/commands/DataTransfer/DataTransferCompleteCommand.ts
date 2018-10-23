import AbstractCommand from '../AbstractCommand'

export class DataTransferCompleteCommand extends AbstractCommand {
	rawName = 'FTDC'

	properties: {
		transferId: number
	}

	deserialize (rawCommand: Buffer) {
		this.properties = {
			transferId: rawCommand.readUInt16BE(0)
		}
	}
}
