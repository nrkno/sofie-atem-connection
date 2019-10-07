import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { Util } from '../..'

export class SuperSourceConfigCommand extends DeserializedCommand<{ superSourceBoxes: number }> {
	static readonly rawName = '_SSC'

	constructor (properties: SuperSourceConfigCommand['properties']) {
		super(properties)
	}

	static deserialize (rawCommand: Buffer) {
		const properties = {
			superSourceBoxes: Util.parseNumberBetween(rawCommand[0], 0, 4)
		}

		return new SuperSourceConfigCommand(properties)
	}

	applyToState (state: AtemState) {
		state.info = {
			...state.info,
			...this.properties
		}
		return `info`
	}
}
