import { DeserializedCommand } from '../../CommandBase'
import { AtemState } from '../../../state'
import { Util } from '../../..'

export interface FadeToBlackProps {
	isFullyBlack: boolean
	inTransition: boolean
	remainingFrames: number
}

export class FadeToBlackStateCommand extends DeserializedCommand<FadeToBlackProps> {
	static readonly rawName = 'FtbS'

	readonly mixEffect: number

	constructor (mixEffect: number, properties: FadeToBlackProps) {
		super(properties)

		this.mixEffect = mixEffect
	}

	static deserialize (rawCommand: Buffer) {
		const mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		const properties = {
			isFullyBlack: rawCommand.readUInt8(1) === 1,
			inTransition: rawCommand.readUInt8(2) === 1,
			remainingFrames: Util.parseNumberBetween(rawCommand.readUInt8(3), 0, 250)
		}

		return new FadeToBlackStateCommand(mixEffect, properties)
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.fadeToBlack = {
			...mixEffect.fadeToBlack,
			...this.properties
		}
		return `video.ME.${this.mixEffect}.fadeToBlack`
	}
}
