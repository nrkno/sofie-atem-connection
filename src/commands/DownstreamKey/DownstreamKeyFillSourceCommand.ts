import { BasicWritableCommand } from '../CommandBase'

export class DownstreamKeyFillSourceCommand extends BasicWritableCommand<{ input: number }> {
	public static readonly rawName = 'CDsF'

	public readonly downstreamKeyerId: number

	constructor (downstreamKeyerId: number, input: number) {
		super({ input })

		this.downstreamKeyerId = downstreamKeyerId
	}

	public serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.downstreamKeyerId, 0)
		buffer.writeUInt16BE(this.properties.input, 2)
		return buffer
	}
}
