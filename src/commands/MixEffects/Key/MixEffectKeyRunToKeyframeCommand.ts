import { WritableCommand } from '../../CommandBase'
import { UpstreamKeyerMaskSettings } from '../../../state/video/upstreamKeyers'

export class MixEffectKeyRunToKeyframeCommand extends WritableCommand<UpstreamKeyerMaskSettings> {
	public static readonly rawName = 'RFlK'

	public readonly mixEffect: number
	public readonly upstreamKeyerId: number
	public readonly keyFrameId: number

	constructor(mixEffect: number, upstreamKeyerId: number, keyFrameId: number) {
		super()

		this.mixEffect = mixEffect
		this.upstreamKeyerId = upstreamKeyerId
		this.keyFrameId = keyFrameId
	}

	public serialize(): Buffer {
		const buffer = Buffer.alloc(8)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.upstreamKeyerId, 2)
		buffer.writeUInt8(this.keyFrameId, 4)

		return buffer
	}
}
