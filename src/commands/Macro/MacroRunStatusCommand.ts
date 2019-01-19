import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { MacroPlayerState } from '../../state/macro'

export class MacroRunStatusCommand extends AbstractCommand {
	rawName = 'MRPr'

	macroIndexID: number
	properties: MacroPlayerState

	deserialize (rawCommand: Buffer) {
		this.macroIndexID = rawCommand.readUInt16BE(2)

		this.properties = {
			isRunning: Boolean(rawCommand[0] & 1 << 0),
			isWaiting: Boolean(rawCommand[0] & 1 << 1),
			loop: Boolean(rawCommand[1] & 1 << 0),
			macroIndex: this.macroIndexID
		}
	}

	applyToState (state: AtemState) {
		state.macro.macroPlayer = {
			...state.macro.macroPlayer,
			...this.properties
		}
	}
}
