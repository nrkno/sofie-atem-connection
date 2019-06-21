import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { UpstreamKeyerLumaSettings } from '../../../state/video/upstreamKeyers'
import { Util } from '../../..'

export class MixEffectKeyLumaCommand extends AbstractCommand {
	static MaskFlags = {
		preMultiplied: 1 << 0,
		clip: 1 << 1,
		gain: 1 << 2,
		invert: 1 << 3
	}

	rawName = 'CKLm'
	mixEffect: number
	upstreamKeyerId: number
	properties: UpstreamKeyerLumaSettings

	serialize () {
		const buffer = Buffer.alloc(12)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.upstreamKeyerId, 2)

		buffer.writeUInt8(this.properties.preMultiplied ? 1 : 0, 3)
		buffer.writeUInt16BE(this.properties.clip, 4)
		buffer.writeUInt16BE(this.properties.gain, 6)
		buffer.writeUInt8(this.properties.invert ? 1 : 0, 8)

		return buffer
	}
}

export class MixEffectKeyLumaUpdateCommand extends AbstractCommand {
	rawName = 'KeLm'
	mixEffect: number
	upstreamKeyerId: number
	properties: UpstreamKeyerLumaSettings

	deserialize (rawCommand: Buffer) {
		this.mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		this.upstreamKeyerId = Util.parseNumberBetween(rawCommand[1], 0, 3)
		this.properties = {
			preMultiplied: rawCommand[2] === 1,
			clip: Util.parseNumberBetween(rawCommand.readUInt16BE(4), 0, 1000),
			gain: Util.parseNumberBetween(rawCommand.readUInt16BE(6), 0, 1000),
			invert: rawCommand[8] === 1
		}
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId)
		upstreamKeyer.lumaSettings = {
			...this.properties
		}
	}
}
