import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { ProtocolVersion } from '../../enums'

export class VersionCommand extends DeserializedCommand<{ version: ProtocolVersion }> {
	static readonly rawName = '_ver'

	constructor (version: ProtocolVersion) {
		super({ version })
	}

	static deserialize (rawCommand: Buffer) {
		const version = rawCommand.readUInt32BE(0)

		return new VersionCommand(version)
	}

	applyToState (state: AtemState) {
		state.info.apiVersion = this.properties.version
		return `info.apiVersion`
	}
}
