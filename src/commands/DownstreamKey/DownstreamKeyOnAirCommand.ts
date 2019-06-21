import AbstractCommand from '../AbstractCommand'

export class DownstreamKeyOnAirCommand extends AbstractCommand {
	rawName = 'CDsL'
	downstreamKeyerId: number

	properties: {
		onAir: boolean
	}

	serialize () {
		return new Buffer([
			...Buffer.from(this.rawName),
			this.downstreamKeyerId,
			this.properties.onAir,
			0x00, 0x00
		])
	}
}
