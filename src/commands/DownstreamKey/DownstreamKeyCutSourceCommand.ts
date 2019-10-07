import AbstractCommand from '../AbstractCommand'

export class DownstreamKeyCutSourceCommand extends AbstractCommand {
	static readonly rawName = 'CDsC'
	downstreamKeyerId: number
	properties: {
		input: number
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.downstreamKeyerId, 0)
		buffer.writeUInt16BE(this.properties.input, 2)
		return buffer
	}

	updateProps (newProps: { input: number }) {
		this._updateProps(newProps)
	}
}
