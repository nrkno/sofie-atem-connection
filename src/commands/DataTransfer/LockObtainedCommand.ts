import { DeserializedCommand } from '../CommandBase'

export class LockObtainedCommand extends DeserializedCommand<{ index: number }> {
	public static readonly rawName = 'LKOB'

	constructor (index: number) {
		super({ index })
	}

	public static deserialize (rawCommand: Buffer) {
		const index = rawCommand.readUInt16BE(0)

		return new LockObtainedCommand(index)
	}

	public applyToState (): string[] {
		// nothing to do
		return []
	}
}
