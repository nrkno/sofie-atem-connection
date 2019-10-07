import AbstractCommand from '../AbstractCommand'

export class DownstreamKeyRateCommand extends AbstractCommand {
	static readonly rawName = 'CDsR'
	downstreamKeyerId: number
	properties: {
		rate: number
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.downstreamKeyerId, 0)
		buffer.writeUInt8(this.properties.rate, 1)
		return buffer
	}

	updateProps (newProps: { rate: number }) {
		this._updateProps(newProps)
	}
}
