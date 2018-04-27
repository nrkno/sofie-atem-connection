import AbstractCommand from '../AbstractCommand'

export class DownstreamKeyOnAirCommand extends AbstractCommand {
	rawName = 'CDsL'
	downstreamKeyId: number

	properties: {
		onAir: boolean
	}

	deserialize () {
		// nothing
	}

	serialize () {
		let rawCommand = 'CDsL'
		return new Buffer([
			...Buffer.from(rawCommand),
			this.downstreamKeyId,
			this.properties.onAir,
			0x00, 0x00
		])
	}

	applyToState () {
		// nothing
	}
}
