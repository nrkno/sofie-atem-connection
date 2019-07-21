import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { SuperSourceBox } from '../../state/video'
import { Util } from '../..'
import { ProtocolVersion } from '../../enums'

export class SuperSourceBoxParametersCommand extends AbstractCommand {
	static MaskFlags = {
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

	rawName = 'CSBP'
	ssrcId: number
	boxId: number
	properties: SuperSourceBox

	updateProps (newProps: Partial<SuperSourceBox>) {
		this._updateProps(newProps)
	}

	serialize (version: ProtocolVersion) {
		const buffer = Buffer.alloc(24)
		let i = 0
		if (version >= ProtocolVersion.V8_0) {
			i = 1
			buffer.writeUInt8(this.ssrcId, 0)
		}

		buffer.writeUInt16BE(this.flag, i + 0)
		buffer.writeUInt8(this.boxId, i + 2)
		buffer.writeUInt8(this.properties.enabled ? 1 : 0, i + 3)
		buffer.writeUInt16BE(this.properties.source, i + 4)
		buffer.writeInt16BE(this.properties.x, i + 6)
		buffer.writeInt16BE(this.properties.y, i + 8)
		buffer.writeUInt16BE(this.properties.size, i + 10)
		buffer.writeUInt8(this.properties.cropped ? 1 : 0, i + 12)
		buffer.writeUInt16BE(this.properties.cropTop, i + 14)
		buffer.writeUInt16BE(this.properties.cropBottom, i + 16)
		buffer.writeUInt16BE(this.properties.cropLeft, i + 18)
		buffer.writeUInt16BE(this.properties.cropRight, i + 20)
		return buffer
		return Buffer.concat([Buffer.from('CSBP', 'ascii'), buffer])
	}
}

export class SuperSourceBoxParametersUpdateCommand extends AbstractCommand {

	rawName = 'SSBP'
	ssrcId: number
	boxId: number
	properties: SuperSourceBox

	deserialize (rawCommand: Buffer, version: ProtocolVersion) {
		let i = 0
		if (version >= ProtocolVersion.V8_0) {
			i = 1
			this.ssrcId = rawCommand.readUInt8(0)
		} else {
			this.ssrcId = 0
		}

		this.boxId = rawCommand.readUInt8(i + 0)
		this.properties = {
			enabled: rawCommand[i + 1] === 1,
			source: rawCommand.readUInt16BE(i + 2),
			x: Util.parseNumberBetween(rawCommand.readInt16BE(i + 4), -4800, 4800),
			y: Util.parseNumberBetween(rawCommand.readInt16BE(i + 6), -3400, 3400),
			size: Util.parseNumberBetween(rawCommand.readUInt16BE(i + 8), 70, 1000),
			cropped: rawCommand[i + 10] === 1,
			cropTop: Util.parseNumberBetween(rawCommand.readUInt16BE(i + 12), 0, 18000),
			cropBottom: Util.parseNumberBetween(rawCommand.readUInt16BE(i + 14), 0, 18000),
			cropLeft: Util.parseNumberBetween(rawCommand.readUInt16BE(i + 16), 0, 32000),
			cropRight: Util.parseNumberBetween(rawCommand.readUInt16BE(i + 18), 0, 32000)
		}
	}

	applyToState (state: AtemState) {
		const supersource = state.video.getSuperSource(this.ssrcId)
		supersource.boxes[this.boxId] = {
			...this.properties
		}
		return `video.superSources.${this.ssrcId}.boxes.${this.boxId}`
	}
}
