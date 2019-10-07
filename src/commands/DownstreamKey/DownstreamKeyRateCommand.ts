import { BasicWritableCommand } from '../CommandBase'

export class DownstreamKeyRateCommand extends BasicWritableCommand<{ rate: number }> {
	static readonly rawName = 'CDsR'

	readonly downstreamKeyerId: number

	constructor (downstreamKeyerId: number, rate: number) {
		super({ rate })

		this.downstreamKeyerId = downstreamKeyerId
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.downstreamKeyerId, 0)
		buffer.writeUInt8(this.properties.rate, 1)
		return buffer
	}
}
