import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { Util } from '../..'

export class PreviewInputCommand extends AbstractCommand {
	rawName = 'PrvI'
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

	serialize () {
		const rawCommand = 'CPvI'
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
		mixEffect.previewInput = this.properties.source
	}
}
