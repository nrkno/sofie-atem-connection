import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { MacroRecorderState } from '../../state/macro'

export class MacroRecordingStatusCommand extends DeserializedCommand<MacroRecorderState> {
	public static readonly rawName = 'MRcS'

	public static deserialize (rawCommand: Buffer) {
		const properties = {
			isRecording: Boolean(rawCommand.readUInt8(0) & 1 << 0),
			macroIndex: rawCommand.readUInt16BE(2)
		}

		return new MacroRecordingStatusCommand(properties)
	}

	public applyToState (state: AtemState) {
		state.macro.macroRecorder = {
			...state.macro.macroRecorder,
			...this.properties
		}
		return `macro.macroRecorder`
	}
}
