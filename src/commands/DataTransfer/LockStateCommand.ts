import { BasicWritableCommand, DeserializedCommand } from '../CommandBase'

export interface LockStateProps {
	index: number
	locked: boolean
}

export class LockStateCommand extends BasicWritableCommand<LockStateProps> {
	static readonly rawName = 'LOCK'

	constructor (index: number, locked: boolean) {
		super({ index, locked })
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt16BE(this.properties.index, 0)
		buffer[2] = this.properties.locked ? 1 : 0
		return buffer
	}
}

export class LockStateUpdateCommand extends DeserializedCommand<LockStateProps> {
	static readonly rawName = 'LKST'

	static deserialize (rawCommand: Buffer) {
		const properties = {
			index: rawCommand.readUInt16BE(0),
			locked: rawCommand[2] === 1
		}

		return new LockStateUpdateCommand(properties)
	}

	applyToState (): string | string[] {
		// Nothing to do
		return []
	}
}
