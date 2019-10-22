import { BasicWritableCommand, DeserializedCommand } from '../../CommandBase'
import { AtemState } from '../../../state'
import { Util } from '../../..'

export class FadeToBlackRateCommand extends BasicWritableCommand<{ rate: number }> {
	static readonly rawName = 'FtbC'

	readonly mixEffect: number

	constructor (mixEffect: number, rate: number) {
		super({ rate })

		this.mixEffect = mixEffect
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(1, 0)
		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.properties.rate, 2)
		return buffer
	}
}

export class FadeToBlackRateUpdateCommand extends DeserializedCommand<{ rate: number }> {
	static readonly rawName = 'FtbP'

	readonly mixEffect: number

	constructor (mixEffect: number, rate: number) {
		super({ rate })

		this.mixEffect = mixEffect
	}

	static deserialize (rawCommand: Buffer) {
		const mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		const rate = rawCommand.readUInt8(1)

		return new FadeToBlackRateUpdateCommand(mixEffect, rate)
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.fadeToBlack = {
			isFullyBlack: false,
			inTransition: false,
			remainingFrames: 0,
			...mixEffect.fadeToBlack,
			rate: this.properties.rate
		}
		return `video.ME.${this.mixEffect}.fadeToBlack`
	}
}
