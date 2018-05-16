import AbstractCommand from '../AbstractCommand'

export class DownstreamKeyRateCommand extends AbstractCommand {
	rawName = 'CDsR'
	downstreamKeyerId: number
	properties: {
		rate: number
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer[0] = this.downstreamKeyerId
		buffer[1] = this.properties.rate

		return Buffer.concat([Buffer.from('CDsR', 'ascii'), buffer])
	}

	updateProps (newProps: { rate: number }) {
		this._updateProps(newProps)
	}
}
