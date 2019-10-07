import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { Util } from '../..'

export class SuperSourceConfigCommand extends AbstractCommand {
	static readonly rawName = '_SSC'

	readonly properties: Readonly<{
		superSourceBoxes: number
	}>

	constructor (properties: SuperSourceConfigCommand['properties']) {
		super()

		this.properties = properties
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
