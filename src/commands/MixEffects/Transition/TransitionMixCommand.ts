import IAbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../lib/atemState'

export class TransitionMixCommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = 'TMxP' // this seems unnecessary.
	packetId: number

	mixEffect: number
	rate: number // 0...250

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
		this.rate = rawCommand[1]
	}

	serialize () {
		let rawCommand = 'CTMx'
		return new Buffer([...Buffer.from(rawCommand), this.mixEffect, this.rate, 0x00, 0x00])
	}

	getAttributes () {
		return {
			mixEffect: this.mixEffect,
			rate: this.rate
		}
	}

	applyToState (state: AtemState) {
		let mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionSettings.mix.rate = this.rate
	}
}
