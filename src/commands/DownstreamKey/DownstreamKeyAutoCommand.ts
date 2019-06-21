import AbstractCommand from '../AbstractCommand'

export class DownstreamKeyAutoCommand extends AbstractCommand {
	rawName = 'DDsA'
	downstreamKeyerId: number

	properties: null

	serialize () {
		return new Buffer([
			...Buffer.from(this.rawName),
			this.downstreamKeyerId,
			0x00, 0x00, 0x00
		])
	}
}
