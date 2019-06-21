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
		return new Buffer([
			...Buffer.from(this.rawName),
			this.mixEffect,
			0x00,
			this.properties.source >> 8,
			this.properties.source & 0xFF
		])
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
	}
}
