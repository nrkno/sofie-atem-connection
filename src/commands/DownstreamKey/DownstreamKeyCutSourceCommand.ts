import AbstractCommand from '../AbstractCommand'

export class DownstreamKeyCutSourceCommand extends AbstractCommand {
	rawName = 'CDsC'
	downstreamKeyerId: number
	properties: {
		input: number
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer[0] = this.downstreamKeyerId
		buffer.writeUInt16BE(this.properties.input, 2)

		return Buffer.concat([Buffer.from('CDsC', 'ascii'), buffer])
	}

	updateProps (newProps: { input: number }) {
		this._updateProps(newProps)
	}
}
