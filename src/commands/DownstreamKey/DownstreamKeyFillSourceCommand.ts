import AbstractCommand from '../AbstractCommand'

export class DownstreamKeyFillSourceCommand extends AbstractCommand {
	rawName = 'CDsF'
	downstreamKeyerId: number
	properties: {
		input: number
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer[0] = this.downstreamKeyerId
		buffer.writeUInt16BE(this.properties.input, 2)

		return Buffer.concat([Buffer.from('CDsF', 'ascii'), buffer])
	}

	updateProps (newProps: { input: number }) {
		this._updateProps(newProps)
	}
}
