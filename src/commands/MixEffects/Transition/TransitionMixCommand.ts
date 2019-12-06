import { DeserializedCommand, BasicWritableCommand } from '../../CommandBase'
import { AtemState } from '../../../state'
import { MixTransitionSettings } from '../../../state/video'

export class TransitionMixCommand extends BasicWritableCommand<MixTransitionSettings> {
	public static readonly rawName = 'CTMx'

	public readonly mixEffect: number

	constructor (mixEffect: number, rate: number) {
		super({ rate })

		this.mixEffect = mixEffect
	}

	public serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		buffer.writeUInt8(this.properties.rate || 0, 1)
		return buffer
	}
}

export class TransitionMixUpdateCommand extends DeserializedCommand<MixTransitionSettings> {
	public static readonly rawName = 'TMxP'

	public readonly mixEffect: number

	constructor (mixEffect: number, properties: MixTransitionSettings) {
		super(properties)

		this.mixEffect = mixEffect
	}

	public static deserialize (rawCommand: Buffer): TransitionMixUpdateCommand {
		const mixEffect = rawCommand.readUInt8(0)
		const properties = {
			rate: rawCommand.readUInt8(1)
		}

		return new TransitionMixUpdateCommand(mixEffect, properties)
	}

	public applyToState (state: AtemState) {
		if (!state.info.capabilities || this.mixEffect >= state.info.capabilities.mixEffects) {
			throw new Error(`MixEffect ${this.mixEffect} is not valid`)
		}

		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionSettings.mix = {
			...this.properties
		}
		return `video.ME.${this.mixEffect}.transitionSettings.mix`
	}
}
