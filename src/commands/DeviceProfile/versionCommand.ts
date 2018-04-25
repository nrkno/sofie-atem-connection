import IAbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { VersionProps } from '../../state/info'

export interface VersionInfo {
	major: number
	minor: number
}

export class VersionCommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = '_ver'
	packetId: number

	properties: VersionProps

	deserialize (rawCommand: Buffer) {
		this.properties = {
			major: rawCommand[1],
			minor: rawCommand[3]
		}
	}

	serialize () {
		return new Buffer(0)
	}

	getAttributes (): VersionInfo {
		return {
			...this.properties
		}
	}

	applyToState (state: AtemState) {
		state.info.apiVersion = {
			...this.properties
		}
	}
}
