import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { MacroRecorderState } from '../../state/macro'

export class MacroRecordingStatusCommand extends DeserializedCommand<MacroRecorderState> {
	public static readonly rawName = 'MRcS'

	public static deserialize(rawCommand: Buffer): MacroRecordingStatusCommand {
		const properties = {
			isRecording: rawCommand.readUInt8(0) != 0,
			macroIndex: rawCommand.readUInt16BE(2),
		}

		return new MacroRecordingStatusCommand(properties)
	}

	public applyToState(state: AtemState): string {
		state.macro.macroRecorder = {
			...state.macro.macroRecorder,
			...this.properties,
		}
		return `macro.macroRecorder`
	}
}
