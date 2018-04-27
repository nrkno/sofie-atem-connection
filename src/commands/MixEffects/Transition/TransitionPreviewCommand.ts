import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'

export class PreviewTransitionCommand extends AbstractCommand {
	rawName = 'TrPr' // this seems unnecessary.
	mixEffect: number

	properties: {
		preview: boolean
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
		this.properties = {
			preview: rawCommand[1] === 1
		}
	}

	serialize () {
		const rawCommand = 'CTPr'
		return new Buffer([
			...Buffer.from(rawCommand),
			this.mixEffect,
			this.properties.preview,
			0x00, 0x00
		])
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionPreview = this.properties.preview
	}
}
