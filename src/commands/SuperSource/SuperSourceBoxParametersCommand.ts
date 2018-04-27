import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { SuperSourceBox } from '../../state/video'

export class SuperSourceBoxParametersCommand extends AbstractCommand {
	rawName = 'SSBP'
	boxId: number
	properties: SuperSourceBox
	MaskFlags = {
		enabled: 1 << 0,
		source: 1 << 1,
		x: 1 << 2,
		y: 1 << 3,
		size: 1 << 4,
		cropped: 1 << 5,
		cropTop: 1 << 6,
		cropBottom: 1 << 7,
		cropLeft: 1 << 8,
		cropRight: 1 << 9
	}

	updateProps (newProps: Partial<SuperSourceBox>) {
		this._updateProps(newProps)
	}

	deserialize (rawCommand: Buffer) {
		this.boxId = rawCommand[0]
		this.properties = {
			enabled: rawCommand[1] === 1,
			source: rawCommand.readUInt16BE(2),
			x: rawCommand.readInt16BE(4),
			y: rawCommand.readInt16BE(6),
			size: rawCommand.readUInt16BE(8),
			cropped: rawCommand[10] === 1,
			cropTop: rawCommand.readUInt16BE(12),
			cropBottom: rawCommand.readUInt16BE(14),
			cropLeft: rawCommand.readUInt16BE(16),
			cropRight: rawCommand.readUInt16BE(18)
		}
	}

	serialize () {
		const buffer = Buffer.alloc(24)
		buffer.writeUInt16BE(this.flag, 0)
		buffer.writeUInt8(this.boxId, 2)
		buffer.writeUInt8(this.properties.enabled ? 1 : 0, 3)
		buffer.writeUInt16BE(this.properties.source, 4)
		buffer.writeInt16BE(this.properties.x, 6)
		buffer.writeInt16BE(this.properties.y, 8)
		buffer.writeUInt16BE(this.properties.size, 10)
		buffer.writeUInt8(this.properties.cropped ? 1 : 0, 12)
		buffer.writeUInt16BE(this.properties.cropTop, 14)
		buffer.writeUInt16BE(this.properties.cropBottom, 16)
		buffer.writeUInt16BE(this.properties.cropLeft, 18)
		buffer.writeUInt16BE(this.properties.cropRight, 20)
		return Buffer.concat([Buffer.from('CSBP', 'ascii'), buffer])
	}

	applyToState (state: AtemState) {
		state.video.superSourceBoxes[this.boxId] = {
			...this.properties
		}
	}
}
