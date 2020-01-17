import { BasicWritableCommand } from '../CommandBase'

export class DownstreamKeyOnAirCommand extends BasicWritableCommand<{ onAir: boolean }> {
	public static readonly rawName = 'CDsL'

	public readonly downstreamKeyerId: number

	constructor (downstreamKeyerId: number, onAir: boolean) {
		super({ onAir })

		this.downstreamKeyerId = downstreamKeyerId
	}

	public serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.downstreamKeyerId, 0)
		buffer.writeUInt8(this.properties.onAir ? 1 : 0, 1)
		return buffer
	}
}
