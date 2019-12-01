import { BasicWritableCommand, DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { Util } from '../..'
import { InputSource } from './PreviewInputCommand'

export class ProgramInputCommand extends BasicWritableCommand<InputSource> {
	public static readonly rawName = 'CPgI'

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

export class ProgramInputUpdateCommand extends DeserializedCommand<InputSource> {
	public static readonly rawName = 'PrgI'

	public readonly mixEffect: number

	constructor (mixEffect: number, properties: InputSource) {
		super(properties)

		this.mixEffect = mixEffect
	}

	public static deserialize (rawCommand: Buffer): ProgramInputUpdateCommand {
		const mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		const properties = {
			source: rawCommand.readUInt16BE(2)
		}

		return new ProgramInputUpdateCommand(mixEffect, properties)
	}

	public applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.programInput = this.properties.source
		return `video.ME.${this.mixEffect}.programInput`
	}
}
