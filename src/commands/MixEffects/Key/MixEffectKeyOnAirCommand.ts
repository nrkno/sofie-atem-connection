import { BasicWritableCommand, DeserializedCommand } from '../../CommandBase'
import { AtemState } from '../../../state'
import { Util } from '../../..'

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
		const mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		const upstreamKeyerId = Util.parseNumberBetween(rawCommand[1], 0, 3)
		const properties = {
			onAir: rawCommand[2] === 1
		}
		return new MixEffectKeyOnAirUpdateCommand(mixEffect, upstreamKeyerId, properties)
	}

	public applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId)
		upstreamKeyer.onAir = this.properties.onAir
		return `video.ME.${this.mixEffect}.upstreamKeyers.${this.upstreamKeyerId}.onAir`
	}
}
