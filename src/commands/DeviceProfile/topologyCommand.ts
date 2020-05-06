import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { AtemCapabilites } from '../../state/info'
import { ProtocolVersion } from '../../enums'

export class TopologyCommand extends AbstractCommand {
	rawName = '_top'

	properties: AtemCapabilites

	deserialize (rawCommand: Buffer, version: ProtocolVersion) {
		const v230offset = version > ProtocolVersion.V8_0_1 ? 1 : 0
		this.properties = {
			MEs: rawCommand[0],
			sources: rawCommand[1],
			colorGenerators: rawCommand[2],
			auxilliaries: rawCommand[3],
			talkbackOutputs: rawCommand[4],
			mediaPlayers: rawCommand[5],
			serialPorts: rawCommand.readUInt8(6 + v230offset),
			maxHyperdecks: rawCommand.readUInt8(7 + v230offset),
			DVEs: rawCommand.readUInt8(8 + v230offset),
			stingers: rawCommand.readUInt8(9 + v230offset),
			hasSuperSources: rawCommand.readUInt8(10 + v230offset) !== 0,
			superSources: rawCommand.readUInt8(10 + v230offset),
			talkbackOverSDI: rawCommand[13]
		}
	}

	applyToState (state: AtemState) {
		state.info.capabilities = {
			...state.info.capabilities,
			...this.properties
		}
		return `info.capabilities`
	}
}
