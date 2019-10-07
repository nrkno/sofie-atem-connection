import AbstractCommand from '../AbstractCommand'

export class DownstreamKeyTieCommand extends AbstractCommand {
	static readonly rawName = 'CDsT'
	downstreamKeyerId: number

	properties: {
		tie: boolean
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.downstreamKeyerId, 0)
		buffer.writeUInt8(this.properties.tie ? 1 : 0, 1)
		return buffer
	}
}
