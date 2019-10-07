import { DeserializedCommand } from '../CommandBase'

export interface DataTransferErrorProps {
	transferId: number
	errorCode: number
}

export class DataTransferErrorCommand extends DeserializedCommand<DataTransferErrorProps> {
	static readonly rawName = 'FTDE'

	static deserialize (rawCommand: Buffer): DataTransferErrorCommand {
		const properties = {
			transferId: rawCommand.readUInt16BE(0),
			errorCode: rawCommand.readUInt8(2)
		}

		return new DataTransferErrorCommand(properties)
	}

	applyToState (): string[] {
		// Nothing to do
		return []
	}
}
