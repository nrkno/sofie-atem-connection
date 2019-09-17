import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { DipTransitionSettings } from '../../../state/video'
import { Util } from '../../..'

export class TransitionDipCommand extends AbstractCommand {
	static MaskFlags = {
		rate: 1 << 0,
		input: 1 << 1
	}

	rawName = 'CTDp'
	mixEffect: number

	properties: DipTransitionSettings

	updateProps (newProps: Partial<DipTransitionSettings>) {
		this._updateProps(newProps)
	}

	serialize () {
		const buffer = Buffer.alloc(8)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.properties.rate, 2)
		buffer.writeUInt16BE(this.properties.input, 4)
		return buffer
	}
}

export class TransitionDipUpdateCommand extends AbstractCommand {
	rawName = 'TDpP'
	mixEffect: number

	properties: DipTransitionSettings

	deserialize (rawCommand: Buffer) {
		this.mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		this.properties = {
			rate: Util.parseNumberBetween(rawCommand[1], 0, 250),
			input: rawCommand[2] << 8 | (rawCommand[3] & 0xFF)
		}
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionSettings.dip = {
			...this.properties
		}
		return `video.ME.${this.mixEffect}.transitionSettings.dip`
	}
}
