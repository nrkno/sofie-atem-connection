import AbstractCommand from '../AbstractCommand'
import { DownstreamKeyerMask } from '../../state/video/downstreamKeyers'

export class DownstreamKeyMaskCommand extends AbstractCommand {
	static MaskFlags = {
		enabled: 1 << 0,
		top: 1 << 1,
		bottom: 1 << 2,
		left: 1 << 3,
		right: 1 << 4
	}

	rawName = 'CDsM'
	downstreamKeyerId: number
	properties: DownstreamKeyerMask

	serialize () {
		const buffer = Buffer.alloc(12)
		buffer[0] = this.flag
		buffer[1] = this.downstreamKeyerId
		buffer[2] = this.properties.enabled ? 1 : 0

		buffer.writeInt16BE(this.properties.top, 4)
		buffer.writeInt16BE(this.properties.bottom, 6)
		buffer.writeInt16BE(this.properties.left, 8)
		buffer.writeInt16BE(this.properties.right, 10)

		return Buffer.concat([Buffer.from('CDsM', 'ascii'), buffer])
	}

	updateProps (newProps: Partial<DownstreamKeyerMask>) {
		this._updateProps(newProps)
	}
}
