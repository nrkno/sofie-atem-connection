import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { UpstreamKeyerChromaSettings } from '../../../state/video/upstreamKeyers'
import { Util } from '../../..'

export class MixEffectKeyChromaCommand extends AbstractCommand {
	static MaskFlags = {
		hue: 1 << 0,
		gain: 1 << 1,
		ySuppress: 1 << 2,
		lift: 1 << 3,
		narrow: 1 << 4
	}

	rawName = 'CKCk'
	mixEffect: number
	upstreamKeyerId: number
	properties: UpstreamKeyerChromaSettings

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

		return Buffer.concat([Buffer.from(this.rawName, 'ascii'), buffer])
	}
}

export class MixEffectKeyChromaUpdateCommand extends AbstractCommand {
	rawName = 'KeCk'
	mixEffect: number
	upstreamKeyerId: number
	properties: UpstreamKeyerChromaSettings

	deserialize (rawCommand: Buffer) {
		this.mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		this.upstreamKeyerId = Util.parseNumberBetween(rawCommand[1], 0, 3)
		this.properties = {
			hue: Util.parseNumberBetween(rawCommand.readUInt16BE(2), 0, 3599),
			gain: Util.parseNumberBetween(rawCommand.readUInt16BE(4), 0, 1000),
			ySuppress: Util.parseNumberBetween(rawCommand.readUInt16BE(6), 0, 1000),
			lift: Util.parseNumberBetween(rawCommand.readUInt16BE(8), 0, 1000),
			narrow: rawCommand[10] === 1
		}
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId)
		upstreamKeyer.chromaSettings = {
			...this.properties
		}
	}
}
