import AbstractCommand from '../../AbstractCommand'

export class MixEffectKeyCutSourceSetCommand extends AbstractCommand {
	static readonly rawName = 'CKeC'
	mixEffect: number
	upstreamKeyerId: number
	properties: {
		cutSource: number
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		buffer.writeUInt8(this.upstreamKeyerId, 1)
		buffer.writeUInt16BE(this.properties.cutSource, 2)
		return buffer
	}
}
