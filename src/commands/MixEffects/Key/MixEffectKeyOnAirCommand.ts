import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { Util } from '../../..'

export class MixEffectKeyOnAirCommand extends AbstractCommand {
	static readonly rawName = 'CKOn'

	readonly mixEffect: number
	readonly upstreamKeyerId: number
	readonly properties: Readonly<{
		onAir: boolean
	}>

	constructor (mixEffect: number, upstreamKeyerId: number, onAir: boolean) {
		super()

		this.mixEffect = mixEffect
		this.upstreamKeyerId = upstreamKeyerId
		this.properties = { onAir }
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		buffer.writeUInt8(this.upstreamKeyerId, 1)
		buffer.writeUInt8(this.properties.onAir ? 1 : 0, 2)
		return buffer
	}
}

export class MixEffectKeyOnAirUpdateCommand extends AbstractCommand {
	static readonly rawName = 'KeOn'

	readonly mixEffect: number
	readonly upstreamKeyerId: number
	readonly properties: Readonly<{
		onAir: boolean
	}>

	constructor (mixEffect: number, upstreamKeyerId: number, properties: MixEffectKeyOnAirUpdateCommand['properties']) {
		super()

		this.mixEffect = mixEffect
		this.upstreamKeyerId = upstreamKeyerId
		this.properties = properties
	}

	static deserialize (rawCommand: Buffer) {
		const mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		const upstreamKeyerId = Util.parseNumberBetween(rawCommand[1], 0, 3)
		const properties = {
			onAir: rawCommand[2] === 1
		}
		return new MixEffectKeyOnAirUpdateCommand(mixEffect, upstreamKeyerId, properties)
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId)
		upstreamKeyer.onAir = this.properties.onAir
		return `video.ME.${this.mixEffect}.upstreamKeyers.${this.upstreamKeyerId}.onAir`
	}
}
