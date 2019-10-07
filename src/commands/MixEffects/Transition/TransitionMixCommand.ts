import AbstractCommand, { WritableCommand } from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { MixTransitionSettings } from '../../../state/video'
import { Util } from '../../..'

export class TransitionMixCommand extends WritableCommand<MixTransitionSettings> {
	static readonly rawName = 'CTMx'

	readonly mixEffect: number

	constructor (mixEffect: number) {
		super()

		this.mixEffect = mixEffect
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		buffer.writeUInt8(this.properties.rate || 0, 1)
		return buffer
	}
}

export class TransitionMixUpdateCommand extends AbstractCommand {
	static readonly rawName = 'TMxP'

	readonly mixEffect: number
	readonly properties: Readonly<MixTransitionSettings>

	constructor (mixEffect: number, properties: MixTransitionSettings) {
		super()

		this.mixEffect = mixEffect
		this.properties = properties
	}

	static deserialize (rawCommand: Buffer): TransitionMixUpdateCommand {
		const mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		const properties = {
			rate: Util.parseNumberBetween(rawCommand[1], 1, 250)
		}

		return new TransitionMixUpdateCommand(mixEffect, properties)
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionSettings.mix = {
			...this.properties
		}
		return `video.ME.${this.mixEffect}.transitionSettings.mix`
	}
}
