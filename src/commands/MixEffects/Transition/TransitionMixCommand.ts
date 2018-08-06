import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { MixTransitionSettings } from '../../../state/video'
import { Util } from '../../..'

export class TransitionMixCommand extends AbstractCommand {
	rawName = 'TMxP'
	mixEffect: number

	properties: MixTransitionSettings

	updateProps (newProps: Partial<MixTransitionSettings>) {
		this._updateProps(newProps)
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		this.properties = {
			rate: Util.parseNumberBetween(rawCommand[1], 1, 250)
		}
	}

	serialize () {
		const rawCommand = 'CTMx'
		return new Buffer([
			...Buffer.from(rawCommand),
			this.mixEffect,
			this.properties.rate,
			0x00, 0x00
		])
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionSettings.mix = {
			...this.properties
		}
	}
}
