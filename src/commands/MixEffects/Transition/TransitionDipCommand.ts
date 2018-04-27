import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { DipTransitionSettings } from '../../../state/video'

export class TransitionDipCommand extends AbstractCommand {
	rawName = 'TDpP'
	mixEffect: number
	MaskFlags = {
		rate: 1 << 0,
		input: 1 << 1
	}

	properties: DipTransitionSettings

	updateProps (newProps: Partial<DipTransitionSettings>) {
		this._updateProps(newProps)
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
		this.properties = {
			rate: rawCommand[1],
			input: rawCommand[2] << 8 | (rawCommand[3] & 0xFF)
		}
	}

	serialize () {
		const rawCommand = 'CTDp'
		return new Buffer([
			...Buffer.from(rawCommand),
			this.flag,
			this.mixEffect,
			this.properties.rate,
			0x00,
			this.properties.input >> 8,
			this.properties.input & 0xFF,
			0x00,
			0x00
		])
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionSettings.dip = {
			...this.properties
		}
	}
}
