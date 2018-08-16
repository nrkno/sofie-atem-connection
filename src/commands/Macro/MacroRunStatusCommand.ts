import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'

export class MacroRunStatusCommand extends AbstractCommand {
	rawName = 'MRPr'
	index: number

	properties: {
		isRunning: boolean
		isWaiting: boolean
		loop: boolean
	}

	deserialize (rawCommand: Buffer) {
		this.index = rawCommand.readUInt16BE(2)
		this.properties = {
			isRunning: Boolean(rawCommand[0] & 1 << 0),
			isWaiting: Boolean(rawCommand[0] & 1 << 1),
			loop: Boolean(rawCommand[1] & 1 << 0)
		}
	}

	applyToState (state: AtemState) {
		const macro = state.getMacro(this.index)
		Object.assign(macro, this.properties)
	}
}
