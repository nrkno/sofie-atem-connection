import { BasicWritableCommand } from '../../CommandBase'

export class MixEffectKeyRunToCommand extends BasicWritableCommand<{ keyFrameId: number; direction: number }> {
	public static readonly rawName = 'RFlK'

	public readonly mixEffect: number
	public readonly upstreamKeyerId: number

	constructor(mixEffect: number, upstreamKeyerId: number, keyFrameId: number, direction: number) {
		super({ keyFrameId, direction })

		this.mixEffect = mixEffect
		this.upstreamKeyerId = upstreamKeyerId
	}

	public serialize(): Buffer {
		const buffer = Buffer.alloc(8)
		buffer.writeUInt8(2, 0)
		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.upstreamKeyerId, 2)
		buffer.writeUInt8(this.properties.direction, 5)
		buffer.writeUInt8(this.properties.keyFrameId, 4)

		return buffer
	}
}
