import AbstractCommand from '../AbstractCommand'

export class DownstreamKeyAutoCommand extends AbstractCommand {
	rawName = 'DDsA'
	downstreamKeyId: number

	properties: null

	deserialize () {
		// nothing
	}

	serialize () {
		const rawCommand = 'DDsA'
		return new Buffer([
			...Buffer.from(rawCommand),
			this.downstreamKeyId,
			0x00, 0x00, 0x00
		])
	}

	applyToState () {
		// nothing
	}
}
