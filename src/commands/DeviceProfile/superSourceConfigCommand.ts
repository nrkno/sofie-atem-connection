import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { ProtocolVersion } from '../../enums'
import { SuperSourceInfo } from '../../state/info'

export class SuperSourceConfigCommand extends DeserializedCommand<SuperSourceInfo> {
	static readonly rawName = '_SSC'

	readonly ssrcId: number

	constructor (ssrcId: number, properties: SuperSourceInfo) {
		super(properties)

		this.ssrcId = ssrcId
	}

	static deserialize (rawCommand: Buffer, version: ProtocolVersion): SuperSourceConfigCommand {
		if (version >= ProtocolVersion.V8_0) {
			return new SuperSourceConfigCommand(rawCommand[0], { boxCount: rawCommand[2] })
		} else {
			return new SuperSourceConfigCommand(0, { boxCount: rawCommand[0] })
		}
	}

	applyToState (state: AtemState) {
		state.info.superSources[this.ssrcId] = this.properties
		return `info.superSources`
	}
}
