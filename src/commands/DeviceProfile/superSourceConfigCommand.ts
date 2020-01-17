import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { ProtocolVersion } from '../../enums'
import { SuperSourceInfo } from '../../state/info'

export class SuperSourceConfigCommand extends DeserializedCommand<SuperSourceInfo> {
	public static readonly rawName = '_SSC'

	public readonly ssrcId: number

	constructor (ssrcId: number, properties: SuperSourceInfo) {
		super(properties)

		this.ssrcId = ssrcId
	}

	public static deserialize (rawCommand: Buffer, version: ProtocolVersion): SuperSourceConfigCommand {
		if (version >= ProtocolVersion.V8_0) {
			return new SuperSourceConfigCommand(rawCommand.readUInt8(0), { boxCount: rawCommand.readUInt8(2) })
		} else {
			return new SuperSourceConfigCommand(0, { boxCount: rawCommand.readUInt8(0) })
		}
	}

	public applyToState (state: AtemState) {
		state.info.superSources[this.ssrcId] = this.properties
		return `info.superSources`
	}
}
