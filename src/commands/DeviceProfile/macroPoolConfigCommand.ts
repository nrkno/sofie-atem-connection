import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { MacroPoolInfo } from '../../state/info'

export class MacroPoolConfigCommand extends DeserializedCommand<MacroPoolInfo> {
	public static readonly rawName = '_MAC'

	constructor (properties: MacroPoolInfo) {
		super(properties)
	}

	public static deserialize (rawCommand: Buffer): MacroPoolConfigCommand {
		return new MacroPoolConfigCommand({
			macroCount: rawCommand.readUInt8(0)
		})
	}

	public applyToState (state: AtemState) {
		state.info.macroPool = this.properties
		return `info.macroPool`
	}
}
