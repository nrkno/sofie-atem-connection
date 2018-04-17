import IAbstractCommand from '../AbstractCommand'
import { AtemState } from '../../lib/atemState'

export interface VersionInfo {
	major: number
	minor: number
}

export class VersionCommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = '_ver'
	packetId: number

	apiMajor: number
	apiMinor: number

	deserialize (rawCommand: Buffer) {
		this.apiMajor = rawCommand[1]
		this.apiMinor = rawCommand[3]
	}

	serialize () {
		return new Buffer(0)
	}

	getAttributes (): VersionInfo {
		return {
			major: this.apiMajor,
			minor: this.apiMinor
		}
	}

	applyToState (state: AtemState) {
		state.info.apiVersion.major = this.apiMajor
		state.info.apiVersion.minor = this.apiMinor
	}
}
