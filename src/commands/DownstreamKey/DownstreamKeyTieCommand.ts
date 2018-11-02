import AbstractCommand from '../AbstractCommand'

export class DownstreamKeyTieCommand extends AbstractCommand {
	rawName = 'CDsT'
	downstreamKeyerId: number

	properties: {
		tie: boolean
	}

	deserialize () {
		// nothing
	}

	serialize () {
		const rawCommand = 'CDsT'
		return new Buffer([
			...Buffer.from(rawCommand),
			this.downstreamKeyerId,
			this.properties.tie,
			0x00, 0x00
		])
	}

	applyToState () {
		// nothing
	}
}
