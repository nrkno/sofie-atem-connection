import { BasicWritableCommand, DeserializedCommand } from '../../CommandBase'
import { AtemState } from '../../../state'

export class MixEffectKeyOnAirCommand extends BasicWritableCommand<{ onAir: boolean}> {
	public static readonly rawName = 'CKOn'

	public readonly mixEffect: number
	public readonly upstreamKeyerId: number

	constructor (mixEffect: number, upstreamKeyerId: number, onAir: boolean) {
		super({ onAir })

		this.mixEffect = mixEffect
		this.upstreamKeyerId = upstreamKeyerId
	}

	public serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		buffer.writeUInt8(this.upstreamKeyerId, 1)
		buffer.writeUInt8(this.properties.onAir ? 1 : 0, 2)
		return buffer
	}
}

export class MixEffectKeyOnAirUpdateCommand extends DeserializedCommand<{onAir: boolean}> {
	public static readonly rawName = 'KeOn'

	public readonly mixEffect: number
	public readonly upstreamKeyerId: number

	constructor (mixEffect: number, upstreamKeyerId: number, properties: MixEffectKeyOnAirUpdateCommand['properties']) {
		super(properties)

		this.mixEffect = mixEffect
		this.upstreamKeyerId = upstreamKeyerId
	}

	public static deserialize (rawCommand: Buffer) {
		const mixEffect = rawCommand[0]
		const upstreamKeyerId = rawCommand[1]
		const properties = {
			onAir: rawCommand[2] === 1
		}
		return new MixEffectKeyOnAirUpdateCommand(mixEffect, upstreamKeyerId, properties)
	}

	public applyToState (state: AtemState) {
		if (!state.info.capabilities || this.mixEffect >= state.info.capabilities.mixEffects || this.upstreamKeyerId >= state.info.capabilities.upstreamKeyers) {
			throw new Error(`UpstreamKeyer ${this.mixEffect}-${this.upstreamKeyerId} is not valid`)
		}

		const mixEffect = state.video.getMe(this.mixEffect)
		const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId)
		upstreamKeyer.onAir = this.properties.onAir
		return `video.ME.${this.mixEffect}.upstreamKeyers.${this.upstreamKeyerId}.onAir`
	}
}
