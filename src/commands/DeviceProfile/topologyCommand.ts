import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { AtemCapabilites } from '../../state/info'

export class TopologyCommand extends DeserializedCommand<AtemCapabilites> {
	public static readonly rawName = '_top'

	public static deserialize (rawCommand: Buffer) {
		const properties = {
			mixEffects: rawCommand.readUInt8(0),
			sources: rawCommand.readUInt8(1),
			downstreamKeyers: rawCommand.readUInt8(2),
			auxilliaries: rawCommand.readUInt8(3),
			mixMinusOutputs: rawCommand.readUInt8(4),
			mediaPlayers: rawCommand.readUInt8(5),
			serialPorts: rawCommand.readUInt8(6),
			maxHyperdecks: rawCommand.readUInt8(7),
			DVEs: rawCommand.readUInt8(8),
			stingers: rawCommand.readUInt8(9),
			superSources: rawCommand.readUInt8(10),
			// talkbackOverSDI: rawCommand.readUInt8(13),

			cameraControl: rawCommand.readUInt8(17) === 1,

			// Note: these are defined below as they can overflow in older firmwares
			advancedChromaKeyers: false,

			// TODO - define the below properly
			multiViewers: 2
		}

		// in 7.4?
		if (rawCommand.length > 20) {
			properties.advancedChromaKeyers = rawCommand.readUInt8(21) === 1
		}

		return new TopologyCommand(properties)
	}

	public applyToState (state: AtemState) {
		state.info.capabilities = {
			...state.info.capabilities,
			...this.properties
		}
		return `info.capabilities`
	}
}
