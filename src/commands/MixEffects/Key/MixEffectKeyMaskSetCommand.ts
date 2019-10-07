import AbstractCommand from '../../AbstractCommand'
import { UpstreamKeyerMaskSettings } from '../../../state/video/upstreamKeyers'

export class MixEffectKeyMaskSetCommand extends AbstractCommand {
	static MaskFlags = {
		maskEnabled: 1 << 0,
		maskTop: 1 << 1,
		maskBottom: 1 << 2,
		maskLeft: 1 << 3,
		maskRight: 1 << 4
	}

	static readonly rawName = 'CKMs'
	mixEffect: number
	upstreamKeyerId: number
	properties: UpstreamKeyerMaskSettings

	serialize () {
		const buffer = Buffer.alloc(12)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.upstreamKeyerId, 2)

		buffer.writeUInt8(this.properties.maskEnabled ? 1 : 0, 3)
		buffer.writeInt16BE(this.properties.maskTop, 4)
		buffer.writeInt16BE(this.properties.maskBottom, 6)
		buffer.writeInt16BE(this.properties.maskLeft, 8)
		buffer.writeInt16BE(this.properties.maskRight, 10)

		return buffer
	}
}
