import AbstractCommand from '../AbstractCommand'

export class DataTransferErrorCommand extends AbstractCommand {
	static readonly rawName = 'FTDE'

	readonly properties: Readonly<{
		transferId: number
		errorCode: number
	}>

	constructor (properties: DataTransferErrorCommand['properties']) {
		super()

		this.properties = properties
	}

	static deserialize (rawCommand: Buffer): DataTransferErrorCommand {
		const properties = {
			transferId: rawCommand.readUInt16BE(0),
			errorCode: rawCommand.readUInt8(2)
		}

		return new DataTransferErrorCommand(properties)
	}
}
