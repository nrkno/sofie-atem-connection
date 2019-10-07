import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { AtemCapabilites } from '../../state/info'

export class TopologyCommand extends AbstractCommand {
	static readonly rawName = '_top'

	readonly properties: Readonly<AtemCapabilites>

	constructor (properties: AtemCapabilites) {
		super()

		this.properties = properties
	}

	static deserialize (rawCommand: Buffer) {
		const properties = {
			MEs: rawCommand[0],
			sources: rawCommand[1],
			colorGenerators: rawCommand[2],
			auxilliaries: rawCommand[3],
			talkbackOutputs: rawCommand[4],
			mediaPlayers: rawCommand[5],
			serialPorts: rawCommand[6],
			maxHyperdecks: rawCommand[7],
			DVEs: rawCommand[8],
			stingers: rawCommand[9],
			hasSuperSources: rawCommand[10] !== 0,
			superSources: rawCommand[10],
			talkbackOverSDI: rawCommand[13]
		}

		return new TopologyCommand(properties)
	}

	applyToState (state: AtemState) {
		state.info.capabilities = {
			...state.info.capabilities,
			...this.properties
		}
		return `info.capabilities`
	}
}
