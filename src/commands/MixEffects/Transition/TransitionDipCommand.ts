import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { DipTransitionSettings } from '../../../state/video'
import { Util } from '../../..'

export class TransitionDipCommand extends AbstractCommand {
	static MaskFlags = {
		rate: 1 << 0,
		input: 1 << 1
	}

	rawName = 'TDpP'
	mixEffect: number

	properties: DipTransitionSettings

	updateProps (newProps: Partial<DipTransitionSettings>) {
		this._updateProps(newProps)
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		this.properties = {
			rate: Util.parseNumberBetween(rawCommand[1], 0, 250),
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
