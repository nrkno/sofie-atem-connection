import { WritableCommand, DeserializedCommand } from '../../CommandBase'
import { AtemState } from '../../../state'
import { DipTransitionSettings } from '../../../state/video'

export class TransitionDipCommand extends WritableCommand<DipTransitionSettings> {
	public static MaskFlags = {
		rate: 1 << 0,
		input: 1 << 1
	}
	public static readonly rawName = 'CTDp'

	public readonly mixEffect: number

	constructor (mixEffect: number) {
		super()

		this.mixEffect = mixEffect
	}

	public serialize () {
		const buffer = Buffer.alloc(8)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.properties.rate || 0, 2)
		buffer.writeUInt16BE(this.properties.input || 0, 4)
		return buffer
	}
}

export class TransitionDipUpdateCommand extends DeserializedCommand<DipTransitionSettings> {
	public static readonly rawName = 'TDpP'

	public readonly mixEffect: number

	constructor (mixEffect: number, properties: DipTransitionSettings) {
		super(properties)

		this.mixEffect = mixEffect
	}

	public static deserialize (rawCommand: Buffer): TransitionDipUpdateCommand {
		const mixEffect = rawCommand[0]
		const properties = {
			rate: rawCommand[1],
			input: rawCommand[2] << 8 | (rawCommand[3] & 0xFF)
		}

		return new TransitionDipUpdateCommand(mixEffect, properties)
	}

	public applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionSettings.dip = {
			...this.properties
		}
		return `video.ME.${this.mixEffect}.transitionSettings.dip`
	}
}
