import AbstractCommand from '../AbstractCommand'

export class DownstreamKeyAutoCommand extends AbstractCommand {
	rawName = 'DDsA'
	downstreamKeyerId: number

	properties: null

	deserialize () {
		// nothing
	}

	serialize () {
		const rawCommand = 'DDsA'
		return new Buffer([
			...Buffer.from(rawCommand),
			this.downstreamKeyerId,
			0x00, 0x00, 0x00
		])
	}

	applyToState () {
		// nothing
	}
}
