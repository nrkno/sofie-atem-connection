import IAbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
// import { Util } from '../../../lib/atemUtil'

export enum MaskFlags {
	Rate = 1 << 0,
	Input = 1 << 1
}

export class TransitionDipCommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = 'TDpP'
	packetId: number

	mixEffect: number
	rate: number
	input: number
	flag: MaskFlags

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
		this.rate = rawCommand[1]
		this.input = rawCommand[2] << 8 | (rawCommand[3] & 0xFF)
	}

	serialize () {
		let rawCommand = 'CTDp'
		return new Buffer([
			...Buffer.from(rawCommand),
			this.flag,
			this.mixEffect,
			this.rate,
			0x00,
			this.input >> 8,
			this.input & 0xFF,
			0x00,
			0x00
		])
	}

	getAttributes () {
		return {
			mixEffect: this.mixEffect,
			rate: this.rate,
			input: this.input
		}
	}

	applyToState (state: AtemState) {
		let mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionSettings.dip = {
			source: this.input,
			rate: this.rate
		}
	}
}
