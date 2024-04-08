import * as Enums from '../enums'
import { BasicWritableCommand } from '.'
import { DeserializedCommand } from './CommandBase'
import { AtemState } from '../state'

export class TimeConfigCommand extends BasicWritableCommand<{ mode: Enums.TimeMode }> {
	public static readonly rawName = 'CTCC'
	public static readonly minimumVersion = Enums.ProtocolVersion.V8_1_1

	constructor(mode: Enums.TimeMode) {
		super({ mode })
	}

	public serialize(): Buffer {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.properties.mode, 0)

		return buffer
	}
}

export class TimeConfigUpdateCommand extends DeserializedCommand<{ mode: Enums.TimeMode }> {
	public static readonly rawName = 'TCCc'
	public static readonly minimumVersion = Enums.ProtocolVersion.V8_1_1

	constructor(mode: Enums.TimeMode) {
		super({ mode })
	}

	public static deserialize(rawCommand: Buffer): TimeConfigUpdateCommand {
		const mode = rawCommand.readUInt8(0)

		return new TimeConfigUpdateCommand(mode)
	}

	public applyToState(state: AtemState): string {
		state.settings.timeMode = this.properties.mode
		return 'settings.timeMode'
	}
}
