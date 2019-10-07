import { WritableCommand } from '../CommandBase'
import { ProtocolVersion } from '../../enums'

export class DownstreamKeyAutoCommand extends WritableCommand<{ isTowardsOnAir: boolean }> {
	static readonly MaskFlags = {
		isTowardsOnAir: 1
	}
	static readonly rawName = 'DDsA'

	readonly downstreamKeyerId: number

	constructor (downstreamKeyerId: number) {
		super()

		this.downstreamKeyerId = downstreamKeyerId
	}

	serialize (version: ProtocolVersion) {
		const buffer = Buffer.alloc(4)

		if (version >= ProtocolVersion.V8_0_1) {
			buffer.writeUInt8(this.flag, 0)
			buffer.writeUInt8(this.downstreamKeyerId, 1)
			buffer.writeUInt8(this.properties.isTowardsOnAir ? 1 : 0, 2)
		} else {
			buffer.writeUInt8(this.downstreamKeyerId, 0)
		}

		return buffer
	}
}
