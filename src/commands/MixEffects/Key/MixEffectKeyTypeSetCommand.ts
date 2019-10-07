import { WritableCommand } from '../../CommandBase'
import { UpstreamKeyerTypeSettings } from '../../../state/video/upstreamKeyers'

export class MixEffectKeyTypeSetCommand extends WritableCommand<UpstreamKeyerTypeSettings> {
	static MaskFlags = {
		keyType: 1 << 0,
		flyEnabled: 1 << 1
	}

	static readonly rawName = 'CKTp'

	readonly mixEffect: number
	readonly upstreamKeyerId: number

	constructor (mixEffect: number, upstreamKeyerId: number) {
		super()

		this.mixEffect = mixEffect
		this.upstreamKeyerId = upstreamKeyerId
	}

	serialize () {
		const buffer = Buffer.alloc(8)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.upstreamKeyerId, 2)

		buffer.writeUInt8(this.properties.keyType || 0, 3)
		buffer.writeUInt8(this.properties.flyEnabled ? 1 : 0, 4)

		return buffer
	}
}
