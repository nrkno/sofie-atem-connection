import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { Util } from '../../..'

export class FadeToBlackStateCommand extends AbstractCommand {
	rawName = 'FtbS'
	mixEffect: number

	properties: {
		isFullyBlack: boolean
		inTransition: boolean
		remainingFrames: number
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		this.properties = {
			isFullyBlack: rawCommand.readUInt8(1) === 1,
			inTransition: rawCommand.readUInt8(2) === 1,
			remainingFrames: Util.parseNumberBetween(rawCommand.readUInt8(3), 0, 250)
		}
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
