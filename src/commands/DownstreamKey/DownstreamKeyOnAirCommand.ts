import AbstractCommand from '../AbstractCommand'

export class DownstreamKeyOnAirCommand extends AbstractCommand {
	static readonly rawName = 'CDsL'
	downstreamKeyerId: number

	properties: {
		onAir: boolean
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.downstreamKeyerId, 0)
		buffer.writeUInt8(this.properties.onAir ? 1 : 0, 1)
		return buffer
	}
}
