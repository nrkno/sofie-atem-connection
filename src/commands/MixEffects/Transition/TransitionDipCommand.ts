import { WritableCommand, DeserializedCommand } from '../../CommandBase'
import { AtemState } from '../../../state'
import { DipTransitionSettings } from '../../../state/video'
import { Util } from '../../..'

export class TransitionDipCommand extends WritableCommand<DipTransitionSettings> {
	static MaskFlags = {
		rate: 1 << 0,
		input: 1 << 1
	}
	static readonly rawName = 'CTDp'

	readonly mixEffect: number

	constructor (mixEffect: number) {
		super()

		this.mixEffect = mixEffect
	}

	serialize () {
		const buffer = Buffer.alloc(8)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.properties.rate || 0, 2)
		buffer.writeUInt16BE(this.properties.input || 0, 4)
		return buffer
	}
}

export class TransitionDipUpdateCommand extends DeserializedCommand<DipTransitionSettings> {
	static readonly rawName = 'TDpP'

	readonly mixEffect: number

	constructor (mixEffect: number, properties: DipTransitionSettings) {
		super(properties)

		this.mixEffect = mixEffect
	}

	static deserialize (rawCommand: Buffer): TransitionDipUpdateCommand {
		const mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		const properties = {
			rate: Util.parseNumberBetween(rawCommand[1], 0, 250),
			input: rawCommand[2] << 8 | (rawCommand[3] & 0xFF)
		}

		return new TransitionDipUpdateCommand(mixEffect, properties)
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionSettings.dip = {
			...this.properties
		}
		return `video.ME.${this.mixEffect}.transitionSettings.dip`
	}
}
