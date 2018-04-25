import IAbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'

export class PreviewTransitionCommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = 'TrPr' // this seems unnecessary.
	packetId: number

	mixEffect: number
	preview: boolean

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
		this.preview = rawCommand[1] === 1
	}

	serialize () {
		let rawCommand = 'CTPr'
		return new Buffer([...Buffer.from(rawCommand), this.mixEffect, this.preview, 0x00, 0x00])
	}

	getAttributes () {
		return {
			mixEffect: this.mixEffect,
			preview: this.preview
		}
	}

	applyToState (state: AtemState) {
		let mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionPreview = this.preview
	}
}
