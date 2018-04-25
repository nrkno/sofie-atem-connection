import IAbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { DipTransitionSettings } from '../../../state/video'

export class TransitionDipCommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = 'TDpP'
	packetId: number

	flag: number

	mixEffect: number
	properties: DipTransitionSettings

	MaskFlags = {
		Rate: 1 << 0,
		Input: 1 << 1
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
		this.properties = {
			rate: rawCommand[1],
			input: rawCommand[2] << 8 | (rawCommand[3] & 0xFF)
		}
	}

	serialize () {
		let rawCommand = 'CTDp'
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

	getAttributes () {
		return {
			mixEffect: this.mixEffect,
			...this.properties
		}
	}

	calcFlags (newProps: Partial<DipTransitionSettings>) {
		let flags = 0

		if ('rate' in newProps) {
			flags = flags | this.MaskFlags.Rate
		}
		if ('input' in newProps) {
			flags = flags | this.MaskFlags.Input
		}

		return flags
	}

	applyToState (state: AtemState) {
		let mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionSettings.dip = {
			...this.properties
		}
	}
}
