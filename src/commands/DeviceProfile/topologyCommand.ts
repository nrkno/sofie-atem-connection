import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { AtemCapabilites } from '../../state/info'

export class TopologyCommand extends AbstractCommand {
	rawName = '_top'

	properties: AtemCapabilites

	deserialize (rawCommand: Buffer) {
		this.properties = {
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
			superSources: rawCommand[10]
		}
	}

	applyToState (state: AtemState) {
		state.info.capabilities = {
			...state.info.capabilities,
			...this.properties
		}
	}
}
