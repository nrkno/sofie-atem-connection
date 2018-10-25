import AbstractCommand from '../AbstractCommand'

export class DownstreamKeyOnAirCommand extends AbstractCommand {
	rawName = 'CDsL'
	downstreamKeyerId: number

	properties: {
		onAir: boolean
	}

	deserialize () {
		// nothing
	}

	serialize () {
		const rawCommand = 'CDsL'
		return new Buffer([
			...Buffer.from(rawCommand),
			this.downstreamKeyerId,
			this.properties.onAir,
			0x00, 0x00
		])
	}

	applyToState () {
		// nothing
	}
}
