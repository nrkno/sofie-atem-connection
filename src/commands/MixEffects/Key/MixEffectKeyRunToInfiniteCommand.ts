import { WritableCommand } from '../../CommandBase'
import { UpstreamKeyerMaskSettings } from '../../../state/video/upstreamKeyers'

export class MixEffectKeyRunToInfiniteCommand extends WritableCommand<UpstreamKeyerMaskSettings> {
	public static readonly rawName = 'RFlK'

	public readonly mixEffect: number
	public readonly upstreamKeyerId: number
	public readonly direction: number

	constructor(mixEffect: number, upstreamKeyerId: number, direction: number) {
		super()

		this.mixEffect = mixEffect
		this.upstreamKeyerId = upstreamKeyerId
		this.direction = direction
	}

	public serialize(): Buffer {
		const buffer = Buffer.alloc(8)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.upstreamKeyerId, 2)
		buffer.writeUInt8(this.direction, 2)
		buffer.writeUInt8(0x04, 4)

		return buffer
	}
}
