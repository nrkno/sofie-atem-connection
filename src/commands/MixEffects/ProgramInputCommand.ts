import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'

export class ProgramInputCommand extends AbstractCommand {
	rawName = 'PrgI'
	mixEffect: number

	properties: {
		source: number
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
		this.properties = {
			source: rawCommand.readUInt8(2)
		}
	}

	serialize () {
		const rawCommand = 'CPgI'
		return new Buffer([
			...Buffer.from(rawCommand),
			this.mixEffect,
			0x00,
			this.properties.source >> 8,
			this.properties.source & 0xFF
		])
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.programInput = this.properties.source
	}
}
