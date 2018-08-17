import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'

export class MacroRunStatusCommand extends AbstractCommand {
	rawName = 'MRPr'

	properties: {
		isRunning: boolean
		isWaiting: boolean
		loop: boolean
		macroIndex: number
	}

	deserialize (rawCommand: Buffer) {
		this.properties = {
			isRunning: Boolean(rawCommand[0] & 1 << 0),
			isWaiting: Boolean(rawCommand[0] & 1 << 1),
			loop: Boolean(rawCommand[1] & 1 << 0),
			macroIndex: rawCommand.readUInt16BE(2)
		}
	}

	applyToState (state: AtemState) {
		state.macroPlayer = {
			...state.macroPlayer,
			...this.properties
		}
	}
}
