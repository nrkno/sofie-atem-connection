import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { ProtocolVersion } from '../../enums'

export class VersionCommand extends DeserializedCommand<{ version: ProtocolVersion }> {
	public static readonly rawName = '_ver'

	constructor (version: ProtocolVersion) {
		super({ version })
	}

	public static deserialize (rawCommand: Buffer) {
		const version = rawCommand.readUInt32BE(0)

		return new VersionCommand(version)
	}

	public applyToState (state: AtemState) {
		state.info.apiVersion = this.properties.version
		return `info.apiVersion`
	}
}
