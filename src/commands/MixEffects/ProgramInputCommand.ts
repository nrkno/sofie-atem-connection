import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { Util } from '../..'

export class ProgramInputCommand extends AbstractCommand {
	rawName = 'CPgI'
	mixEffect: number

	properties: {
		source: number
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		buffer.writeUInt16BE(this.properties.source, 2)
		return buffer
	}
}

export class ProgramInputUpdateCommand extends AbstractCommand {
	rawName = 'PrgI'
	mixEffect: number

	properties: {
		source: number
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		this.properties = {
			source: rawCommand.readUInt16BE(2)
		}
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.programInput = this.properties.source
		return `video.ME.${this.mixEffect}.programInput`
	}
}
