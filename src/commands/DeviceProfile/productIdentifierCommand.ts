import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { Util } from '../../lib/atemUtil'
import { Enums } from '../..'

export class ProductIdentifierCommand extends AbstractCommand {
	static readonly rawName = '_pin'

	readonly properties: Readonly<{
		deviceName: string
		model: number
	}>

	constructor (properties: ProductIdentifierCommand['properties']) {
		super()

		this.properties = properties
	}

	static deserialize (rawCommand: Buffer) {
		const properties = {
			deviceName: Util.bufToNullTerminatedString(rawCommand, 0, 40),
			model: Util.parseEnum<Enums.Model>(rawCommand[40], Enums.Model)
		}

		return new ProductIdentifierCommand(properties)
	}

	applyToState (state: AtemState) {
		state.info.productIdentifier = this.properties.deviceName
		state.info.model = this.properties.model

		// Model specific features that aren't specified by the protocol
		switch (state.info.model) {
			case Enums.Model.TwoME:
			case Enums.Model.TwoME4K:
			case Enums.Model.TwoMEBS4K:
			case Enums.Model.Constellation:
			case Enums.Model.Constellation8K:
				state.info.power = [false, false]
				break
			default:
				state.info.power = [false]
				break
		}

		return `info`
	}
}
