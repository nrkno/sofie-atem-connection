import { DeserializedCommand } from '../CommandBase'

export interface DataTransferAckProps {
	transferId: number
	transferIndex: number
}

export class DataTransferAckCommand extends DeserializedCommand<DataTransferAckProps> {
	static readonly rawName = 'FTUA'

	static deserialize (rawCommand: Buffer): DataTransferAckCommand {
		const properties = {
			transferId: rawCommand.readUInt16BE(0),
			transferIndex: rawCommand.readUInt8(2)
		}

		return new DataTransferAckCommand(properties)
	}

	applyToState (): string[] {
		// Nothing to do
		return []
	}
}
