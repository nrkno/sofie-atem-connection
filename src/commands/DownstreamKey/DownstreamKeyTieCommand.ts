import AbstractCommand from '../AbstractCommand'

export class DownstreamKeyTieCommand extends AbstractCommand {
	rawName = 'CDsT'
	downstreamKeyerId: number

	properties: {
		tie: boolean
	}

	serialize () {
		return new Buffer([
			...Buffer.from(this.rawName),
			this.downstreamKeyerId,
			this.properties.tie,
			0x00, 0x00
		])
	}
}
