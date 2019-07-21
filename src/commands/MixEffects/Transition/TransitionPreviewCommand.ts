import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { Util } from '../../..'

export class PreviewTransitionCommand extends AbstractCommand {
	rawName = 'CTPr'
	mixEffect: number

	properties: {
		preview: boolean
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		buffer.writeUInt8(this.properties.preview ? 1 : 0, 1)
		return buffer
	}
}

export class PreviewTransitionUpdateCommand extends AbstractCommand {
	rawName = 'TrPr'
	mixEffect: number

	properties: {
		preview: boolean
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		this.properties = {
			preview: rawCommand[1] === 1
		}
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionPreview = this.properties.preview
		return `video.ME.${this.mixEffect}.transitionPreview`
	}
}
