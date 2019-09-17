import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { ProtocolVersion } from '../../enums'

export class VersionCommand extends AbstractCommand {
	rawName = '_ver'

	properties: {
		version: ProtocolVersion
	}

	deserialize (rawCommand: Buffer) {
		this.properties = {
			version: rawCommand.readUInt32BE(0)
		}
	}

	applyToState (state: AtemState) {
		state.info.apiVersion = this.properties.version
		return `info.apiVersion`
	}
}
