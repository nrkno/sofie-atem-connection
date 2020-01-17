import { BasicWritableCommand } from '../../CommandBase'

export class MixEffectKeyFillSourceSetCommand extends BasicWritableCommand<{ fillSource: number }> {
	public static readonly rawName = 'CKeF'

	public readonly mixEffect: number
	public readonly upstreamKeyerId: number

	constructor (mixEffect: number, upstreamKeyerId: number, fillSource: number) {
		super({ fillSource })

		this.mixEffect = mixEffect
		this.upstreamKeyerId = upstreamKeyerId
	}

	public serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		buffer.writeUInt8(this.upstreamKeyerId, 1)
		buffer.writeUInt16BE(this.properties.fillSource, 2)
		return buffer
	}
}
