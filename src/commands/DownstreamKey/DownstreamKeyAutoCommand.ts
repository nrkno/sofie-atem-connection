import AbstractCommand from '../AbstractCommand'
import { ProtocolVersion } from '../../enums'

export class DownstreamKeyAutoCommand extends AbstractCommand {
	static readonly rawName = 'DDsA'
	downstreamKeyerId: number

	MaskFlags = {
		isTowardsOnAir: 1
	}

	properties: {
		isTowardsOnAir?: boolean
	}

	updateProps (newProps: Partial<DownstreamKeyAutoCommand['properties']>) {
		this._updateProps(newProps)
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
