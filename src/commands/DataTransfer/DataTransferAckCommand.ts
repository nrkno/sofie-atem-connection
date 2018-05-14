import AbstractCommand from '../AbstractCommand'

export class DataTransferAckCommand extends AbstractCommand {
	rawName = 'FTUA'

	properties: {
		transferId: number,
		transferIndex: number
	}

	deserialize (rawCommand: Buffer) {
		this.properties = {
			transferId: rawCommand.readUInt16BE(0),
			transferIndex: rawCommand.readUInt8(2)
		}
	}
}
