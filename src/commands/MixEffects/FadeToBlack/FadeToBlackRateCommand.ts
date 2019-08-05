import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { Util } from '../../..'

export class FadeToBlackRateCommand extends AbstractCommand {
	rawName = 'FtbC'
	mixEffect: number

	properties: {
		rate: number
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(1, 0)
		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.properties.rate, 2)
		return buffer
	}
}

export class FadeToBlackRateUpdateCommand extends AbstractCommand {
	rawName = 'FtbP'
	mixEffect: number

	properties: {
		rate: number
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
		return `video.ME.${this.mixEffect}.fadeToBlack`
	}
}
