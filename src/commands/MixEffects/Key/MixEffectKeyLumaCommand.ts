import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { UpstreamKeyerLumaSettings } from '../../../state/video/upstreamKeyers'

export class MixEffectKeyLumaCommand extends AbstractCommand {
	rawName = 'KeLm'
	mixEffect: number
	upstreamKeyerId: number
	properties: UpstreamKeyerLumaSettings
	MaskFlags = {
		preMultiplied: 1 << 0,
		clip: 1 << 1,
		gain: 1 << 2,
		invert: 1 << 3
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
		this.upstreamKeyerId = rawCommand[1]
		this.properties = {
			preMultiplied: rawCommand[2] === 1,
			clip: rawCommand.readUInt16BE(4),
			gain: rawCommand.readUInt16BE(6),
			invert: rawCommand[8] === 1
		}
	}

	serialize () {
		const buffer = Buffer.alloc(12)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.upstreamKeyerId, 2)

		buffer[3] = this.properties.preMultiplied ? 1 : 0
		buffer.writeUInt16BE(this.properties.clip, 4)
		buffer.writeUInt16BE(this.properties.gain, 6)
		buffer[8] = this.properties.invert ? 1 : 0

		return Buffer.concat([Buffer.from('CKLm', 'ascii'), buffer])
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId)
		upstreamKeyer.lumaSettings = {
			...this.properties
		}
	}
}
