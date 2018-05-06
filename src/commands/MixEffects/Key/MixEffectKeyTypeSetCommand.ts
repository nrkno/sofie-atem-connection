import AbstractCommand from '../../AbstractCommand'
import { UpstreamKeyerTypeSettings } from '../../../state/video/upstreamKeyers'

export class MixEffectKeyTypeSetCommand extends AbstractCommand {
	rawName = 'CKTp'
	mixEffect: number
	upstreamKeyerId: number
	properties: UpstreamKeyerTypeSettings
	MaskFlags = {
		keyType: 1 << 0,
		flyEnabled: 1 << 1
	}

	serialize () {
		const buffer = Buffer.alloc(8)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.upstreamKeyerId, 2)

		buffer.writeUInt8(this.properties.keyType, 3)
		buffer[4] = this.properties.flyEnabled ? 1 : 0

		return Buffer.concat([Buffer.from('CKTp', 'ascii'), buffer])
	}
}
