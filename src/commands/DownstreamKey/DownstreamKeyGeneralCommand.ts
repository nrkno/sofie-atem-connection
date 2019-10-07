import { WritableCommand } from '../CommandBase'
import { DownstreamKeyerGeneral } from '../../state/video/downstreamKeyers'

export class DownstreamKeyGeneralCommand extends WritableCommand<DownstreamKeyerGeneral> {
	static MaskFlags = {
		preMultiply: 1 << 0,
		clip: 1 << 1,
		gain: 1 << 2,
		invert: 1 << 3
	}

	static readonly rawName = 'CDsG'

	readonly downstreamKeyerId: number

	constructor (downstreamKeyerId: number) {
		super()

		this.downstreamKeyerId = downstreamKeyerId
	}

	serialize () {
		const buffer = Buffer.alloc(12)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.downstreamKeyerId, 1)
		buffer.writeUInt8(this.properties.preMultiply ? 1 : 0, 2)
		buffer.writeInt16BE(this.properties.clip || 0, 4)
		buffer.writeInt16BE(this.properties.gain || 0, 6)
		buffer.writeUInt8(this.properties.invert ? 1 : 0, 8)
		return buffer
	}
}
