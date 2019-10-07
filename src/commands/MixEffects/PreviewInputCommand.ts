import AbstractCommand, { BasicWritableCommand } from '../AbstractCommand'
import { AtemState } from '../../state'
import { Util } from '../..'

export interface InputSource {
	source: number
}

export class PreviewInputCommand extends BasicWritableCommand<InputSource> {
	static readonly rawName = 'CPvI'

	readonly mixEffect: number

	constructor (mixEffect: number, source: number) {
		super()

		this.mixEffect = mixEffect
		this.properties = {
			source
		}
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		buffer.writeUInt16BE(this.properties.source, 2)
		return buffer
	}
}

export class PreviewInputUpdateCommand extends AbstractCommand {
	static readonly rawName = 'PrvI'
	readonly mixEffect: number

	readonly properties: Readonly<InputSource>

	constructor (mixEffect: number, properties: InputSource) {
		super()

		this.mixEffect = mixEffect
		this.properties = properties
	}

	static deserialize (rawCommand: Buffer): PreviewInputUpdateCommand {
		const mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		const properties = {
			source: rawCommand.readUInt16BE(2)
		}

		return new PreviewInputUpdateCommand(mixEffect, properties)
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.previewInput = this.properties.source
		return `video.ME.${this.mixEffect}.previewInput`
	}
}
