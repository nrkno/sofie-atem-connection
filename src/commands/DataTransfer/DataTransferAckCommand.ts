import AbstractCommand from '../AbstractCommand'

export class DataTransferAckCommand extends AbstractCommand {
	static readonly rawName = 'FTUA'

	readonly properties: Readonly<{
		transferId: number,
		transferIndex: number
	}>

	constructor (properties: DataTransferAckCommand['properties']) {
		super()

		this.properties = properties
	}

	static deserialize (rawCommand: Buffer): DataTransferAckCommand {
		const properties = {
			transferId: rawCommand.readUInt16BE(0),
			transferIndex: rawCommand.readUInt8(2)
		}

		return new DataTransferAckCommand(properties)
	}
}
