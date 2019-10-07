import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { ProtocolVersion } from '../../enums'

export class VersionCommand extends AbstractCommand {
	static readonly rawName = '_ver'

	readonly properties: Readonly<{
		version: ProtocolVersion
	}>

	constructor (properties: VersionCommand['properties']) {
		super()

		this.properties = properties
	}

	static deserialize (rawCommand: Buffer) {
		const properties = {
			version: rawCommand.readUInt32BE(0)
		}

		return new VersionCommand(properties)
	}

	applyToState (state: AtemState) {
		state.info.apiVersion = this.properties.version
		return `info.apiVersion`
	}
}
