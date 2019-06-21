import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { VersionProps } from '../../state/info'

export class VersionCommand extends AbstractCommand {
	rawName = '_ver'

	properties: VersionProps

	deserialize (rawCommand: Buffer) {
		this.properties = {
			major: rawCommand[1],
			minor: rawCommand[3]
		}
	}

	applyToState (state: AtemState) {
		state.info.apiVersion = {
			...this.properties
		}
	}
}
