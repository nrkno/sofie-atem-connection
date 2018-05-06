import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { UpstreamKeyerChromaSettings } from '../../../state/video/upstreamKeyers'

export class MixEffectKeyChromaCommand extends AbstractCommand {
	rawName = 'KeCk'
	mixEffect: number
	upstreamKeyerId: number
	properties: UpstreamKeyerChromaSettings
	MaskFlags = {
		hue: 1 << 0,
		gain: 1 << 1,
		ySuppress: 1 << 2,
		lift: 1 << 3,
		narrow: 1 << 4
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
		this.upstreamKeyerId = rawCommand[1]
		this.properties = {
			hue: rawCommand.readUInt16BE(2),
			gain: rawCommand.readUInt16BE(4),
			ySuppress: rawCommand.readUInt16BE(6),
			lift: rawCommand.readUInt16BE(8),
			narrow: rawCommand[10] === 1
		}
	}

	serialize () {
		const buffer = Buffer.alloc(16)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.upstreamKeyerId, 2)

		buffer.writeUInt16BE(this.properties.hue, 4)
		buffer.writeUInt16BE(this.properties.gain, 6)
		buffer.writeUInt16BE(this.properties.ySuppress, 8)
		buffer.writeUInt16BE(this.properties.lift, 10)
		buffer[12] = this.properties.narrow ? 1 : 0

		return Buffer.concat([Buffer.from('CKCk', 'ascii'), buffer])
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId)
		upstreamKeyer.chromaSettings = {
			...this.properties
		}
	}
}
