import { DeserializedCommand } from '../CommandBase'

export interface DataTransferAckProps {
	transferId: number
	transferIndex: number
}

export class DataTransferAckCommand extends DeserializedCommand<DataTransferAckProps> {
	public static readonly rawName = 'FTUA'

	public static deserialize (rawCommand: Buffer): DataTransferAckCommand {
		const properties = {
			transferId: rawCommand.readUInt16BE(0),
			transferIndex: rawCommand.readUInt8(2)
		}

		return new DataTransferAckCommand(properties)
	}

	public applyToState (): string[] {
		// Nothing to do
		return []
	}
}
