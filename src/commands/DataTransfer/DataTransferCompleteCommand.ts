import { DeserializedCommand } from '../CommandBase'

export class DataTransferCompleteCommand extends DeserializedCommand<{ transferId: number }> {
	static readonly rawName = 'FTDC'

	static deserialize (rawCommand: Buffer): DataTransferCompleteCommand {
		const properties = {
			transferId: rawCommand.readUInt16BE(0)
		}

		return new DataTransferCompleteCommand(properties)
	}

	applyToState (): string[] {
		// Nothing to do
		return []
	}
}
