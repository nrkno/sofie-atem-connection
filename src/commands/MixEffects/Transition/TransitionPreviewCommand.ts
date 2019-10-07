import { BasicWritableCommand, DeserializedCommand } from '../../CommandBase'
import { AtemState } from '../../../state'
import { Util } from '../../..'

export interface PreviewProps {
	preview: boolean
}

export class PreviewTransitionCommand extends BasicWritableCommand<PreviewProps> {
	static readonly rawName = 'CTPr'

	readonly mixEffect: number

	constructor (mixEffect: number, preview: boolean) {
		super({ preview })

		this.mixEffect = mixEffect
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		buffer.writeUInt8(this.properties.preview ? 1 : 0, 1)
		return buffer
	}
}

export class PreviewTransitionUpdateCommand extends DeserializedCommand<PreviewProps> {
	static readonly rawName = 'TrPr'

	readonly mixEffect: number

	constructor (mixEffect: number, properties: PreviewProps) {
		super(properties)

		this.mixEffect = mixEffect
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
