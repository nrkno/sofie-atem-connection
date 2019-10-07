import AbstractCommand from '../AbstractCommand'
import { DownstreamKeyerGeneral } from '../../state/video/downstreamKeyers'

export class DownstreamKeyGeneralCommand extends AbstractCommand {
	static MaskFlags = {
		preMultiply: 1 << 0,
		clip: 1 << 1,
		gain: 1 << 2,
		invert: 1 << 3
	}

	static readonly rawName = 'CDsG'
	downstreamKeyerId: number
	properties: DownstreamKeyerGeneral

	serialize () {
		const buffer = Buffer.alloc(12)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.downstreamKeyerId, 1)
		buffer.writeUInt8(this.properties.preMultiply ? 1 : 0, 2)
		buffer.writeInt16BE(this.properties.clip, 4)
		buffer.writeInt16BE(this.properties.gain, 6)
		buffer.writeUInt8(this.properties.invert ? 1 : 0, 8)
		return buffer
	}

	updateProps (newProps: Partial<DownstreamKeyerGeneral>) {
		this._updateProps(newProps)
	}
}
