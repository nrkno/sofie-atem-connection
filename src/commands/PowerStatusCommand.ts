import AbstractCommand from './AbstractCommand'
import { AtemState } from '../state'

/**
 * This command gets the power status from the Atem. As defined in
 * DeviceProfile/productIdentifierCommand.ts the 2ME, 2ME 4K and the
 * Broadcast Studio have 2 power supplies. All other models have 1.
 */
export class PowerStatusCommand extends AbstractCommand {
	static readonly rawName = 'Powr'

	readonly properties: Readonly<boolean[]>

	constructor (properties: boolean[]) {
		super()

		this.properties = properties
	}

	static deserialize (rawCommand: Buffer): PowerStatusCommand {
		const properties = [
			Boolean(rawCommand[0] & 1 << 0),
			Boolean(rawCommand[0] & 1 << 1)
		]

		return new PowerStatusCommand(properties)
	}

	applyToState (state: AtemState) {
		const count = state.info.power.length
		state.info.power = this.properties.slice(0, count)
		return `info.power`
	}
}
