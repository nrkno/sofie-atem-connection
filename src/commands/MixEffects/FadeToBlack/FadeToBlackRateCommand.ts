import { BasicWritableCommand, DeserializedCommand } from '../../CommandBase'
import { AtemState } from '../../../state'

export class FadeToBlackRateCommand extends BasicWritableCommand<{ rate: number }> {
	public static readonly rawName = 'FtbC'

	public readonly mixEffect: number

	constructor (mixEffect: number, rate: number) {
		super({ rate })

		this.mixEffect = mixEffect
	}

	public serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(1, 0)
		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.properties.rate, 2)
		return buffer
	}
}

export class FadeToBlackRateUpdateCommand extends DeserializedCommand<{ rate: number }> {
	public static readonly rawName = 'FtbP'

	public readonly mixEffect: number

	constructor (mixEffect: number, rate: number) {
		super({ rate })

		this.mixEffect = mixEffect
	}

	public static deserialize (rawCommand: Buffer) {
		const mixEffect = rawCommand.readUInt8(0)
		const rate = rawCommand.readUInt8(1)

		return new FadeToBlackRateUpdateCommand(mixEffect, rate)
	}

	public applyToState (state: AtemState) {
		if (!state.info.capabilities || this.mixEffect >= state.info.capabilities.mixEffects) {
			throw new Error(`MixEffect ${this.mixEffect} is not valid`)
		}

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
