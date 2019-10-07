import { BasicWritableCommand, IDeserializedCommand } from '../CommandBase'

export interface DataTransferDataProps {
	transferId: number
	body: Buffer
}

export class DataTransferDataCommand extends BasicWritableCommand<DataTransferDataProps> implements IDeserializedCommand {
	static readonly rawName = 'FTDa'

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt16BE(this.properties.transferId, 0)
		buffer.writeUInt16BE(this.properties.body.length, 2)

		return Buffer.concat([ buffer, this.properties.body ])
	}

	static deserialize (rawCommand: Buffer): DataTransferDataCommand {
		const properties = {
			transferId: rawCommand.readUInt16BE(0),
			size: rawCommand.readUInt16BE(2),
			body: rawCommand.slice(4, 4 + rawCommand.readUInt16BE(2))
		}

		return new DataTransferDataCommand(properties)
	}

	applyToState (): string[] {
		// Nothing to do
		return []
	}
}
