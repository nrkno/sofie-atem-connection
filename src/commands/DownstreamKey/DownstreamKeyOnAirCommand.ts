import { BasicWritableCommand } from '../CommandBase'

export class DownstreamKeyOnAirCommand extends BasicWritableCommand<{ onAir: boolean }> {
	static readonly rawName = 'CDsL'

	readonly downstreamKeyerId: number

	constructor (downstreamKeyerId: number, onAir: boolean) {
		super({ onAir })

		this.downstreamKeyerId = downstreamKeyerId
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.downstreamKeyerId, 0)
		buffer.writeUInt8(this.properties.onAir ? 1 : 0, 1)
		return buffer
	}
}
