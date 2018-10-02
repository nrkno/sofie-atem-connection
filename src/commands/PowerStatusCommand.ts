import AbstractCommand from './AbstractCommand'
import { AtemState } from '../state'

export class PowerStatusCommand extends AbstractCommand {
	rawName = 'Powr'

	properties: {
		pin1: boolean
		pin2: boolean
	}

	deserialize (rawCommand: Buffer) {
		this.properties = {
			pin1: Boolean(rawCommand[0] & 1 << 0),
			pin2: Boolean(rawCommand[0] & 1 << 1)
		}
	}

	applyToState (state: AtemState) {
		state.info.power = {
			...this.properties
		}
	}
}
