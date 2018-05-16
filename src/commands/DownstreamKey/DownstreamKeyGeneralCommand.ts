import AbstractCommand from '../AbstractCommand'
import { DownstreamKeyerGeneral } from '../../state/video/downstreamKeyers'

export class DownstreamKeyGeneralCommand extends AbstractCommand {
	rawName = 'CDsG'
	downstreamKeyerId: number
	properties: DownstreamKeyerGeneral
	MaskFlags = {
		preMultiply: 1 << 0,
		clip: 1 << 1,
		gain: 1 << 2,
		invert: 1 << 3
	}

	serialize () {
		const buffer = Buffer.alloc(12)
		buffer[0] = this.flag
		buffer[1] = this.downstreamKeyerId
		buffer[2] = this.properties.preMultiply ? 1 : 0
		buffer.writeInt16BE(this.properties.clip, 4)
		buffer.writeInt16BE(this.properties.gain, 6)
		buffer[8] = this.properties.invert ? 1 : 0

		return Buffer.concat([Buffer.from('CDsG', 'ascii'), buffer])
	}

	updateProps (newProps: Partial<DownstreamKeyerGeneral>) {
		this._updateProps(newProps)
	}
}
