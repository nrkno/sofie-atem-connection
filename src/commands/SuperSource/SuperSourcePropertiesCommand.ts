import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { SuperSourceProperties, SuperSourceBorder, SuperSource } from '../../state/video'
import { Util, Enums } from '../..'
import { ProtocolVersion } from '../../enums'

export class SuperSourcePropertiesCommand extends AbstractCommand {
	static MaskFlags = {
		artFillSource: 1 << 0,
		artCutSource: 1 << 1,
		artOption: 1 << 2,
		artPreMultiplied: 1 << 3,
		artClip: 1 << 4,
		artGain: 1 << 5,
		artInvertKey: 1 << 6,

		borderEnabled: 1 << 7,
		borderBevel: 1 << 8,
		borderOuterWidth: 1 << 9,
		borderInnerWidth: 1 << 10,
		borderOuterSoftness: 1 << 11,
		borderInnerSoftness: 1 << 12,
		borderBevelSoftness: 1 << 13,
		borderBevelPosition: 1 << 14,
		borderHue: 1 << 15,
		borderSaturation: 1 << 16,
		borderLuma: 1 << 17,
		borderLightSourceDirection: 1 << 18,
		borderLightSourceAltitude: 1 << 19
	}

	rawName = 'CSSc'
	properties: SuperSourceProperties & SuperSourceBorder

	updateProps (newProps: Partial<SuperSourceProperties & SuperSourceBorder>) {
		this._updateProps(newProps)
	}

	serialize () {
		const buffer = Buffer.alloc(36)

		buffer.writeUInt32BE(this.flag, 0)
		buffer.writeUInt16BE(this.properties.artFillSource, 4)
		buffer.writeUInt16BE(this.properties.artCutSource, 6)
		buffer.writeUInt8(this.properties.artOption, 8)
		buffer.writeUInt8(this.properties.artPreMultiplied ? 1 : 0, 9)
		buffer.writeUInt16BE(this.properties.artClip, 10)
		buffer.writeUInt16BE(this.properties.artGain, 12)
		buffer.writeUInt8(this.properties.artInvertKey ? 1 : 0, 14)

		buffer.writeUInt8(this.properties.borderEnabled ? 1 : 0, 15)
		buffer.writeUInt8(this.properties.borderBevel, 16)
		buffer.writeUInt16BE(this.properties.borderOuterWidth, 18)
		buffer.writeUInt16BE(this.properties.borderInnerWidth, 20)
		buffer.writeUInt8(this.properties.borderOuterSoftness, 22)
		buffer.writeUInt8(this.properties.borderInnerSoftness, 23)
		buffer.writeUInt8(this.properties.borderBevelSoftness, 24)
		buffer.writeUInt8(this.properties.borderBevelPosition, 25)
		buffer.writeUInt16BE(this.properties.borderHue, 26)
		buffer.writeUInt16BE(this.properties.borderSaturation, 28)
		buffer.writeUInt16BE(this.properties.borderLuma, 30)
		buffer.writeUInt16BE(this.properties.borderLightSourceDirection, 32)
		buffer.writeUInt8(this.properties.borderLightSourceAltitude, 34)

		return buffer
	}
}

export class SuperSourcePropertiesV8Command extends AbstractCommand {
	static MaskFlags = {
		artFillSource: 1 << 0,
		artCutSource: 1 << 1,
		artOption: 1 << 2,
		artPreMultiplied: 1 << 3,
		artClip: 1 << 4,
		artGain: 1 << 5,
		artInvertKey: 1 << 6
	}

	rawName = 'CSSc'
	minimumVersion = ProtocolVersion.V8_0
	ssrcId: number
	properties: SuperSourceProperties

	updateProps (newProps: Partial<SuperSourceProperties>) {
		this._updateProps(newProps)
	}

	serialize () {
		const buffer = Buffer.alloc(16)

		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.ssrcId, 1)

		buffer.writeUInt16BE(this.properties.artFillSource, 2)
		buffer.writeUInt16BE(this.properties.artCutSource, 4)
		buffer.writeUInt8(this.properties.artOption, 6)
		buffer.writeUInt8(this.properties.artPreMultiplied ? 1 : 0, 7)
		buffer.writeUInt16BE(this.properties.artClip, 8)
		buffer.writeUInt16BE(this.properties.artGain, 10)
		buffer.writeUInt8(this.properties.artInvertKey ? 1 : 0, 12)

		return buffer
	}
}

export class SuperSourceBorderCommand extends AbstractCommand {
	static MaskFlags = {
		borderEnabled: 1 << 0,
		borderBevel: 1 << 1,
		borderOuterWidth: 1 << 2,
		borderInnerWidth: 1 << 3,
		borderOuterSoftness: 1 << 4,
		borderInnerSoftness: 1 << 5,
		borderBevelSoftness: 1 << 6,
		borderBevelPosition: 1 << 7,
		borderHue: 1 << 8,
		borderSaturation: 1 << 9,
		borderLuma: 1 << 10,
		borderLightSourceDirection: 1 << 11,
		borderLightSourceAltitude: 1 << 12
	}

	rawName = 'CSBd'
	minimumVersion = ProtocolVersion.V8_0
	ssrcId: number
	properties: SuperSourceBorder

	updateProps (newProps: Partial<SuperSourceBorder>) {
		this._updateProps(newProps)
	}

	serialize () {
		const buffer = Buffer.alloc(24)

		buffer.writeUInt16BE(this.flag, 0)
		buffer.writeUInt8(this.ssrcId, 2)

		buffer.writeUInt8(this.properties.borderEnabled ? 1 : 0, 3)
		buffer.writeUInt8(this.properties.borderBevel, 4)
		buffer.writeUInt16BE(this.properties.borderOuterWidth, 6)
		buffer.writeUInt16BE(this.properties.borderInnerWidth, 8)
		buffer.writeUInt8(this.properties.borderOuterSoftness, 10)
		buffer.writeUInt8(this.properties.borderInnerSoftness, 11)
		buffer.writeUInt8(this.properties.borderBevelSoftness, 12)
		buffer.writeUInt8(this.properties.borderBevelPosition, 13)
		buffer.writeUInt16BE(this.properties.borderHue, 14)
		buffer.writeUInt16BE(this.properties.borderSaturation, 16)
		buffer.writeUInt16BE(this.properties.borderLuma, 18)
		buffer.writeUInt16BE(this.properties.borderLightSourceDirection, 20)
		buffer.writeUInt8(this.properties.borderLightSourceAltitude, 22)

		return buffer
	}
}

export class SuperSourcePropertiesUpdateCommand extends AbstractCommand {
	rawName = 'SSrc'
	properties: Pick<SuperSource, 'properties' | 'border'>

	deserialize (rawCommand: Buffer) {
		this.properties = {
			properties: {
				artFillSource: rawCommand.readUInt16BE(0),
				artCutSource: rawCommand.readUInt16BE(2),
				artOption: Util.parseEnum<Enums.SuperSourceArtOption>(rawCommand.readUInt8(4), Enums.SuperSourceArtOption),
				artPreMultiplied: rawCommand[5] === 1,
				artClip: Util.parseNumberBetween(rawCommand.readUInt16BE(6), 0, 1000),
				artGain: Util.parseNumberBetween(rawCommand.readUInt16BE(8), 0, 1000),
				artInvertKey: rawCommand[10] === 1
			},

			border: {
				borderEnabled: rawCommand[11] === 1,
				borderBevel: Util.parseEnum<Enums.BorderBevel>(rawCommand.readUInt8(12), Enums.BorderBevel),
				borderOuterWidth: Util.parseNumberBetween(rawCommand.readUInt16BE(14), 0, 1600),
				borderInnerWidth: Util.parseNumberBetween(rawCommand.readUInt16BE(16), 0, 1600),
				borderOuterSoftness: Util.parseNumberBetween(rawCommand.readUInt8(18), 0, 100),
				borderInnerSoftness: Util.parseNumberBetween(rawCommand.readUInt8(19), 0, 100),
				borderBevelSoftness: Util.parseNumberBetween(rawCommand.readUInt8(20), 0, 100),
				borderBevelPosition: Util.parseNumberBetween(rawCommand.readUInt8(21), 0, 100),
				borderHue: Util.parseNumberBetween(rawCommand.readUInt16BE(22), 0, 3599),
				borderSaturation: Util.parseNumberBetween(rawCommand.readUInt16BE(24), 0, 1000),
				borderLuma: Util.parseNumberBetween(rawCommand.readUInt16BE(26), 0, 1000),
				borderLightSourceDirection: Util.parseNumberBetween(rawCommand.readUInt16BE(28), 0, 3599),
				borderLightSourceAltitude: Util.parseNumberBetween(rawCommand.readUInt8(30), 0, 100)
			}
		}
	}

	applyToState (state: AtemState) {
		const supersource = state.video.getSuperSource(0)
		supersource.properties = {
			...this.properties.properties
		}
		supersource.border = {
			...this.properties.border
		}
		return [
			`video.superSources.0.properties`,
			`video.superSources.0.border`
		]
	}
}

export class SuperSourcePropertiesUpdateV8Command extends AbstractCommand {
	rawName = 'SSrc'
	minimumVersion = ProtocolVersion.V8_0
	ssrcId: number
	properties: SuperSourceProperties

	deserialize (rawCommand: Buffer) {
		this.ssrcId = rawCommand.readUInt8(0)
		this.properties = {
			artFillSource: rawCommand.readUInt16BE(2),
			artCutSource: rawCommand.readUInt16BE(4),
			artOption: Util.parseEnum<Enums.SuperSourceArtOption>(rawCommand.readUInt8(6), Enums.SuperSourceArtOption),
			artPreMultiplied: rawCommand[7] === 1,
			artClip: Util.parseNumberBetween(rawCommand.readUInt16BE(8), 0, 1000),
			artGain: Util.parseNumberBetween(rawCommand.readUInt16BE(10), 0, 1000),
			artInvertKey: rawCommand[12] === 1
		}
	}

	applyToState (state: AtemState) {
		const supersource = state.video.getSuperSource(this.ssrcId)
		supersource.properties = {
			...this.properties
		}
		return `video.superSources.${this.ssrcId}.properties`
	}
}

export class SuperSourceBorderUpdateCommand extends AbstractCommand {
	rawName = 'SSBd'
	minimumVersion = ProtocolVersion.V8_0
	ssrcId: number
	properties: SuperSourceBorder

	deserialize (rawCommand: Buffer) {
		this.ssrcId = rawCommand.readUInt8(0)
		this.properties = {
			borderEnabled: rawCommand[1] === 1,
			borderBevel: Util.parseEnum<Enums.BorderBevel>(rawCommand.readUInt8(2), Enums.BorderBevel),
			borderOuterWidth: Util.parseNumberBetween(rawCommand.readUInt16BE(4), 0, 1600),
			borderInnerWidth: Util.parseNumberBetween(rawCommand.readUInt16BE(6), 0, 1600),
			borderOuterSoftness: Util.parseNumberBetween(rawCommand.readUInt8(8), 0, 100),
			borderInnerSoftness: Util.parseNumberBetween(rawCommand.readUInt8(9), 0, 100),
			borderBevelSoftness: Util.parseNumberBetween(rawCommand.readUInt8(10), 0, 100),
			borderBevelPosition: Util.parseNumberBetween(rawCommand.readUInt8(11), 0, 100),
			borderHue: Util.parseNumberBetween(rawCommand.readUInt16BE(12), 0, 3599),
			borderSaturation: Util.parseNumberBetween(rawCommand.readUInt16BE(14), 0, 1000),
			borderLuma: Util.parseNumberBetween(rawCommand.readUInt16BE(16), 0, 1000),
			borderLightSourceDirection: Util.parseNumberBetween(rawCommand.readUInt16BE(18), 0, 3599),
			borderLightSourceAltitude: Util.parseNumberBetween(rawCommand.readUInt8(20), 0, 100)
		}
	}

	applyToState (state: AtemState) {
		const supersource = state.video.getSuperSource(this.ssrcId)
		supersource.border = {
			...this.properties
		}
		return `video.superSources.${this.ssrcId}.border`
	}
}
