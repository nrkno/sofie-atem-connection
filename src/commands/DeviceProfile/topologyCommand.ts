import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { AtemCapabilites } from '../../state/info'
import { ProtocolVersion } from '../../enums'

export class TopologyCommand extends DeserializedCommand<AtemCapabilites> {
	public static readonly rawName = '_top'

	public static deserialize(rawCommand: Buffer, version: ProtocolVersion) {
		const v230offset = version > ProtocolVersion.V8_0_1 ? 1 : 0
		const properties = {
			mixEffects: rawCommand.readUInt8(0),
			sources: rawCommand.readUInt8(1),
			downstreamKeyers: rawCommand.readUInt8(2),
			auxilliaries: rawCommand.readUInt8(3),
			mixMinusOutputs: rawCommand.readUInt8(4),
			mediaPlayers: rawCommand.readUInt8(5),
			serialPorts: rawCommand.readUInt8(6 + v230offset),
			maxHyperdecks: rawCommand.readUInt8(7 + v230offset),
			DVEs: rawCommand.readUInt8(8 + v230offset),
			stingers: rawCommand.readUInt8(9 + v230offset),
			superSources: rawCommand.readUInt8(10 + v230offset),
			// talkbackOverSDI: rawCommand.readUInt8(13),

			cameraControl: rawCommand.readUInt8(17) === 1,

			// Note: these are defined below as they can overflow in older firmwares
			advancedChromaKeyers: false
		}

		// in 7.4?
		if (rawCommand.length > 20) {
			properties.advancedChromaKeyers = rawCommand.readUInt8(21) === 1
		}

		return new TopologyCommand(properties)
	}

	public applyToState(state: AtemState) {
		state.info.capabilities = {
			...state.info.capabilities,
			...this.properties
		}
		return `info.capabilities`
	}
}
