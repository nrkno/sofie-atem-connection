import AbstractCommand from '../AbstractCommand'

export class DataTransferCompleteCommand extends AbstractCommand {
	static readonly rawName = 'FTDC'

	readonly properties: Readonly<{
		transferId: number
	}>

	constructor (properties: DataTransferCompleteCommand['properties']) {
		super()

		this.properties = properties
	}

	static deserialize (rawCommand: Buffer): DataTransferCompleteCommand {
		const properties = {
			transferId: rawCommand.readUInt16BE(0)
		}

		return new DataTransferCompleteCommand(properties)
	}
}
