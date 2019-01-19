import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { MacroRecorderState } from '../../state/macro'

export class MacroRecordingStatusCommand extends AbstractCommand {
	rawName = 'MRcS'

	macroIndexID: number
	properties: MacroRecorderState

	deserialize (rawCommand: Buffer) {
		this.macroIndexID = rawCommand.readUInt16BE(2)

		this.properties = {
			isRecording: Boolean(rawCommand[0] & 1 << 0),
			macroIndex: this.macroIndexID
		}
	}

	applyToState (state: AtemState) {
		state.macro.macroRecorder = {
			...state.macro.macroRecorder,
			...this.properties
		}
	}
}
