import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { ProtocolVersion } from '../../enums'
import { SuperSourceInfo } from '../../state/info'

export class SuperSourceConfigCommand extends AbstractCommand {
	rawName = '_SSC'

	ssrcId: number
	properties: SuperSourceInfo

	deserialize (rawCommand: Buffer, version: ProtocolVersion) {
		if (version >= ProtocolVersion.V8_0) {
			this.ssrcId = rawCommand[0]
			this.properties = {
				boxCount: rawCommand[2]
			}
		} else {
			this.ssrcId = 0
			this.properties = {
				boxCount: rawCommand[0]
			}
		}
	}

	applyToState (state: AtemState) {
		state.info.superSources[this.ssrcId] = this.properties
		return `info.superSources`
	}
}
