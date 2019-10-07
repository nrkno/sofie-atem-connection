import { DeserializedCommand } from '../CommandBase'

export class LockObtainedCommand extends DeserializedCommand<{ index: number }> {
	static readonly rawName = 'LKOB'

	constructor (index: number) {
		super({ index })
	}

	static deserialize (rawCommand: Buffer) {
		const index = rawCommand.readUInt16BE(0)

		return new LockObtainedCommand(index)
	}

	applyToState (): string[] {
		// nothing to do
		return []
	}
}
