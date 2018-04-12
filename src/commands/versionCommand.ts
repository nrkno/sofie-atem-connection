import AbstractCommand from './AbstractCommand'

export interface VersionInfo {
	major: number
	minor: number
}

export class VersionCommand implements AbstractCommand {
	rawName = '_ver'
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
}
