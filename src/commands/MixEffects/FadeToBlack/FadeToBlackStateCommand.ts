import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { Util } from '../../..'

export class FadeToBlackStateCommand extends AbstractCommand {
	static readonly rawName = 'FtbS'

	readonly mixEffect: number
	readonly properties: Readonly<{
		isFullyBlack: boolean
		inTransition: boolean
		remainingFrames: number
	}>

	constructor (mixEffect: number, properties: FadeToBlackStateCommand['properties']) {
		super()

		this.mixEffect = mixEffect
		this.properties = properties
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
