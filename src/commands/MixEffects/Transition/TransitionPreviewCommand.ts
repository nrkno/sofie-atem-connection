import AbstractCommand, { BasicWritableCommand } from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { Util } from '../../..'

export interface PreviewProps {
	preview: boolean
}

export class PreviewTransitionCommand extends BasicWritableCommand<PreviewProps> {
	static readonly rawName = 'CTPr'

	readonly mixEffect: number

	constructor (mixEffect: number, preview: boolean) {
		super()

		this.mixEffect = mixEffect
		this.properties = { preview }
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		buffer.writeUInt8(this.properties.preview ? 1 : 0, 1)
		return buffer
	}
}

export class PreviewTransitionUpdateCommand extends AbstractCommand {
	static readonly rawName = 'TrPr'

	readonly mixEffect: number
	readonly properties: Readonly<PreviewProps>

	constructor (mixEffect: number, properties: PreviewProps) {
		super()

		this.mixEffect = mixEffect
		this.properties = properties
	}

	static deserialize (rawCommand: Buffer): PreviewTransitionUpdateCommand {
		const mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		const properties = {
			preview: rawCommand[1] === 1
		}

		return new PreviewTransitionUpdateCommand(mixEffect, properties)
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionPreview = this.properties.preview
		return `video.ME.${this.mixEffect}.transitionPreview`
	}
}
