import { BasicWritableCommand, DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'

export interface InputSource {
	source: number
}

export class PreviewInputCommand extends BasicWritableCommand<InputSource> {
	public static readonly rawName = 'CPvI'

	public readonly mixEffect: number

	constructor (mixEffect: number, source: number) {
		super({ source })

		this.mixEffect = mixEffect
	}

	public serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		buffer.writeUInt16BE(this.properties.source, 2)
		return buffer
	}
}

export class PreviewInputUpdateCommand extends DeserializedCommand<InputSource> {
	public static readonly rawName = 'PrvI'

	public readonly mixEffect: number

	constructor (mixEffect: number, properties: InputSource) {
		super(properties)

		this.mixEffect = mixEffect
	}

	public static deserialize (rawCommand: Buffer): PreviewInputUpdateCommand {
		const mixEffect = rawCommand[0]
		const properties = {
			source: rawCommand.readUInt16BE(2)
		}

		return new PreviewInputUpdateCommand(mixEffect, properties)
	}

	public applyToState (state: AtemState) {
		if (!state.info.capabilities || this.mixEffect >= state.info.capabilities.mixEffects) {
			throw new Error(`MixEffect ${this.mixEffect} is not valid`)
		}

		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.previewInput = this.properties.source
		return `video.ME.${this.mixEffect}.previewInput`
	}
}
