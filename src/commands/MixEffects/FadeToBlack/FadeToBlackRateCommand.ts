import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { Util } from '../../..'

export class FadeToBlackRateCommand extends AbstractCommand {
	static MaskFlags = {
		rate: 1
	}

	rawName = 'FtbP'
	mixEffect: number

	properties: {
		rate: number
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.properties.rate, 2)

		return Buffer.concat([
			Buffer.from('FtbC'),
			buffer
		])
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		this.properties = {
			rate: rawCommand.readUInt8(1)
		}
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.fadeToBlack = {
			...mixEffect.fadeToBlack,
			rate: this.properties.rate
		}
	}
}
