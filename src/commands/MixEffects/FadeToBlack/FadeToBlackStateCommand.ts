import { DeserializedCommand } from '../../CommandBase'
import { AtemState } from '../../../state'

export interface FadeToBlackProps {
	isFullyBlack: boolean
	inTransition: boolean
	remainingFrames: number
}

export class FadeToBlackStateCommand extends DeserializedCommand<FadeToBlackProps> {
	public static readonly rawName = 'FtbS'

	public readonly mixEffect: number

	constructor (mixEffect: number, properties: FadeToBlackProps) {
		super(properties)

		this.mixEffect = mixEffect
	}

	public static deserialize (rawCommand: Buffer) {
		const mixEffect = rawCommand.readUInt8(0)
		const properties = {
			isFullyBlack: rawCommand.readUInt8(1) === 1,
			inTransition: rawCommand.readUInt8(2) === 1,
			remainingFrames: rawCommand.readUInt8(3)
		}

		return new FadeToBlackStateCommand(mixEffect, properties)
	}

	public applyToState (state: AtemState) {
		if (!state.info.capabilities || this.mixEffect >= state.info.capabilities.mixEffects) {
			throw new Error(`MixEffect ${this.mixEffect} is not valid`)
		}

		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.fadeToBlack = {
			rate: 0,
			...mixEffect.fadeToBlack,
			...this.properties
		}
		return `video.ME.${this.mixEffect}.fadeToBlack`
	}
}
