import { WritableCommand, DeserializedCommand } from '../../CommandBase'
import { AtemState } from '../../../state'
import { TransitionProperties } from '../../../state/video'

export class TransitionPropertiesCommand extends WritableCommand<TransitionProperties> {
	public static MaskFlags = {
		style: 1 << 0,
		selection: 1 << 1
	}

	public static readonly rawName = 'CTTp'

	public readonly mixEffect: number

	constructor (mixEffect: number) {
		super()

		this.mixEffect = mixEffect
	}

	public serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.flag, 0)

		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.properties.style || 0, 2)
		buffer.writeUInt8(this.properties.selection || 0, 3)

		return buffer
	}
}

export class TransitionPropertiesUpdateCommand extends DeserializedCommand<TransitionProperties> {
	public static readonly rawName = 'TrSS'

	public readonly mixEffect: number

	constructor (mixEffect: number, properties: TransitionProperties) {
		super(properties)

		this.mixEffect = mixEffect
	}

	public static deserialize (rawCommand: Buffer): TransitionPropertiesUpdateCommand {
		const mixEffect = rawCommand[0]
		const properties = {
			style: rawCommand.readUInt8(1),
			selection: rawCommand.readUInt8(2),
			nextStyle: rawCommand.readUInt8(3),
			nextSelection: rawCommand.readUInt8(4)
		}

		return new TransitionPropertiesUpdateCommand(mixEffect, properties)
	}

	public applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionProperties = {
			...this.properties
		}
		return `video.ME.${this.mixEffect}.transitionProperties`
	}
}
