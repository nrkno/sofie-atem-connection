import AbstractCommand from '../AbstractCommand'

export class DownstreamKeyAutoCommand extends AbstractCommand {
	rawName = 'DDsA'
	downstreamKeyerId: number

	properties: null

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.downstreamKeyerId, 0)
		return buffer
	}
}
