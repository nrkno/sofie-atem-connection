import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { Util } from '../../..'

export class MixEffectKeyOnAirCommand extends AbstractCommand {
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

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		buffer.writeUInt8(this.upstreamKeyerId, 1)
		buffer[2] = this.properties.onAir ? 1 : 0
		return Buffer.concat([Buffer.from('CKOn', 'ascii'), buffer])
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId)
		upstreamKeyer.onAir = this.properties.onAir
	}
}
