import { BasicWritableCommand } from '../../CommandBase'

export class MixEffectKeyRunToCommand extends BasicWritableCommand<{ keyFrameId: number; direction: number }> {
	public static readonly rawName = 'RFlK'

	public readonly mixEffect: number
	public readonly upstreamKeyerId: number
	public readonly keyFrameId: number
	public readonly direction: number

	constructor(mixEffect: number, upstreamKeyerId: number, keyFrameId: number, direction: number) {
		super({ keyFrameId, direction })

		this.mixEffect = mixEffect
		this.upstreamKeyerId = upstreamKeyerId
		this.keyFrameId = keyFrameId
		this.direction = direction
	}

	public serialize(): Buffer {
		const buffer = Buffer.alloc(8)
		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.upstreamKeyerId, 2)
		buffer.writeUInt8(this.keyFrameId, 4)
		buffer.writeUInt8(this.direction, 5)

		return buffer
	}
}
