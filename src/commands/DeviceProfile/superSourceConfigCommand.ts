import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { Util } from '../..'

export class SuperSourceConfigCommand extends AbstractCommand {
	rawName = '_SSC'

	properties: {
		superSourceBoxes: number
	}

	deserialize (rawCommand: Buffer) {
		this.properties = {
			superSourceBoxes: Util.parseNumberBetween(rawCommand[0], 0, 4)
		}
	}

	applyToState (state: AtemState) {
		state.info = {
			...state.info,
			...this.properties
		}
		return `info`
	}
}
