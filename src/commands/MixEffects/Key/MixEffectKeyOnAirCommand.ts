import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { Util } from '../../..'

export class MixEffectKeyOnAirCommand extends AbstractCommand {
	rawName = 'CKOn'
	mixEffect: number
	upstreamKeyerId: number
	properties: {
		onAir: boolean
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
	rawName = 'KeOn'
	mixEffect: number
	upstreamKeyerId: number
	properties: {
		onAir: boolean
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		this.upstreamKeyerId = Util.parseNumberBetween(rawCommand[1], 0, 3)
		this.properties = {
			onAir: rawCommand[2] === 1
		}
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId)
		upstreamKeyer.onAir = this.properties.onAir
		return `video.ME.${this.mixEffect}.upstreamKeyers.${this.upstreamKeyerId}.onAir`
	}
}
