import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { MacroPlayerState } from '../../state/macro'

export class MacroRunStatusCommand extends DeserializedCommand<MacroPlayerState> {
	public static readonly rawName = 'MRPr'

	public static deserialize (rawCommand: Buffer) {
		const properties = {
			isRunning: Boolean(rawCommand[0] & 1 << 0),
			isWaiting: Boolean(rawCommand[0] & 1 << 1),
			loop: Boolean(rawCommand[1] & 1 << 0),
			macroIndex: rawCommand.readUInt16BE(2)
		}

		return new MacroRunStatusCommand(properties)
	}

	public applyToState (state: AtemState) {
		state.macro.macroPlayer = {
			...state.macro.macroPlayer,
			...this.properties
		}
		return `macro.macroPlayer`
	}
}
