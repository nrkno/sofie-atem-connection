import { BasicWritableCommand } from '../../CommandBase'

export class MixEffectKeyCutSourceSetCommand extends BasicWritableCommand<{ cutSource: number }> {
	static readonly rawName = 'CKeC'

	readonly mixEffect: number
	readonly upstreamKeyerId: number

	constructor (mixEffect: number, upstreamKeyerId: number, cutSource: number) {
		super({ cutSource })

		this.mixEffect = mixEffect
		this.upstreamKeyerId = upstreamKeyerId
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		buffer.writeUInt8(this.upstreamKeyerId, 1)
		buffer.writeUInt16BE(this.properties.cutSource, 2)
		return buffer
	}
}
