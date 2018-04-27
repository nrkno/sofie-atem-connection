import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { VersionProps } from '../../state/info'

export class VersionCommand extends AbstractCommand {
	rawName = '_ver'

	properties: VersionProps

	updateProps (newProps: Partial<VersionProps>) {
		this._updateProps(newProps)
	}

	deserialize (rawCommand: Buffer) {
		this.properties = {
			major: rawCommand[1],
			minor: rawCommand[3]
		}
	}

	serialize () {
		return new Buffer(0)
	}

	applyToState (state: AtemState) {
		state.info.apiVersion = {
			...this.properties
		}
	}
}
