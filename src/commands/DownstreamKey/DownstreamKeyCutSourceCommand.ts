import { BasicWritableCommand } from '../CommandBase'

export class DownstreamKeyCutSourceCommand extends BasicWritableCommand<{ input: number }> {
	static readonly rawName = 'CDsC'

	readonly downstreamKeyerId: number

	constructor (downstreamKeyerId: number, input: number) {
		super({ input })

		this.downstreamKeyerId = downstreamKeyerId
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.downstreamKeyerId, 0)
		buffer.writeUInt16BE(this.properties.input, 2)
		return buffer
	}
}
