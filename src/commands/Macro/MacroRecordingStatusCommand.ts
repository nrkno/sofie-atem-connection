import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { MacroRecorderState } from '../../state/macro'

export class MacroRecordingStatusCommand extends AbstractCommand {
	static readonly rawName = 'MRcS'

	readonly properties: Readonly<MacroRecorderState>

	constructor (properties: MacroRecorderState) {
		super()

		this.properties = properties
	}

	static deserialize (rawCommand: Buffer) {
		const properties = {
			isRecording: Boolean(rawCommand[0] & 1 << 0),
			macroIndex: rawCommand.readUInt16BE(2)
		}

		return new MacroRecordingStatusCommand(properties)
	}

	applyToState (state: AtemState) {
		state.macro.macroRecorder = {
			...state.macro.macroRecorder,
			...this.properties
		}
		return `macro.macroRecorder`
	}
}
