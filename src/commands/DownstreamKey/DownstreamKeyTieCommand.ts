import { BasicWritableCommand } from '../CommandBase'

export class DownstreamKeyTieCommand extends BasicWritableCommand<{ tie: boolean }> {
	static readonly rawName = 'CDsT'

	readonly downstreamKeyerId: number

	constructor (downstreamKeyerId: number, tie: boolean) {
		super({ tie })

		this.downstreamKeyerId = downstreamKeyerId
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.downstreamKeyerId, 0)
		buffer.writeUInt8(this.properties.tie ? 1 : 0, 1)
		return buffer
	}
}
