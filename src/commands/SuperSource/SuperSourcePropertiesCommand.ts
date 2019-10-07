import { WritableCommand, DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { SuperSourceProperties, SuperSourceBorder, SuperSource } from '../../state/video'
import { Util, Enums } from '../..'
import { ProtocolVersion } from '../../enums'

export class SuperSourcePropertiesCommand extends WritableCommand<SuperSourceProperties & SuperSourceBorder> {
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
	static readonly rawName = 'CSSc'

	constructor () {
		super()
	}

	serialize () {
		const buffer = Buffer.alloc(36)

		buffer.writeUInt32BE(this.flag, 0)
		buffer.writeUInt16BE(this.properties.artFillSource || 0, 4)
		buffer.writeUInt16BE(this.properties.artCutSource || 0, 6)
		buffer.writeUInt8(this.properties.artOption || 0, 8)
		buffer.writeUInt8(this.properties.artPreMultiplied ? 1 : 0, 9)
		buffer.writeUInt16BE(this.properties.artClip || 0, 10)
		buffer.writeUInt16BE(this.properties.artGain || 0, 12)
		buffer.writeUInt8(this.properties.artInvertKey ? 1 : 0, 14)

		buffer.writeUInt8(this.properties.borderEnabled ? 1 : 0, 15)
		buffer.writeUInt8(this.properties.borderBevel || 0, 16)
		buffer.writeUInt16BE(this.properties.borderOuterWidth || 0, 18)
		buffer.writeUInt16BE(this.properties.borderInnerWidth || 0, 20)
		buffer.writeUInt8(this.properties.borderOuterSoftness || 0, 22)
		buffer.writeUInt8(this.properties.borderInnerSoftness || 0, 23)
		buffer.writeUInt8(this.properties.borderBevelSoftness || 0, 24)
		buffer.writeUInt8(this.properties.borderBevelPosition || 0, 25)
		buffer.writeUInt16BE(this.properties.borderHue || 0, 26)
		buffer.writeUInt16BE(this.properties.borderSaturation || 0, 28)
		buffer.writeUInt16BE(this.properties.borderLuma || 0, 30)
		buffer.writeUInt16BE(this.properties.borderLightSourceDirection || 0, 32)
		buffer.writeUInt8(this.properties.borderLightSourceAltitude || 0, 34)

		return buffer
	}
}

export class SuperSourcePropertiesV8Command extends WritableCommand<SuperSourceProperties> {
	static MaskFlags = {
		artFillSource: 1 << 0,
		artCutSource: 1 << 1,
		artOption: 1 << 2,
		artPreMultiplied: 1 << 3,
		artClip: 1 << 4,
		artGain: 1 << 5,
		artInvertKey: 1 << 6
	}

	static readonly rawName = 'CSSc'
	static readonly minimumVersion = ProtocolVersion.V8_0

	readonly ssrcId: number

	constructor (ssrcId: number) {
		super()

		this.ssrcId = ssrcId
	}

	serialize () {
		const buffer = Buffer.alloc(16)

		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.ssrcId, 1)

		buffer.writeUInt16BE(this.properties.artFillSource || 0, 2)
		buffer.writeUInt16BE(this.properties.artCutSource || 0, 4)
		buffer.writeUInt8(this.properties.artOption || 0, 6)
		buffer.writeUInt8(this.properties.artPreMultiplied ? 1 : 0, 7)
		buffer.writeUInt16BE(this.properties.artClip || 0, 8)
		buffer.writeUInt16BE(this.properties.artGain || 0, 10)
		buffer.writeUInt8(this.properties.artInvertKey ? 1 : 0, 12)

		return buffer
	}
}

export class SuperSourceBorderCommand extends WritableCommand<SuperSourceBorder> {
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

	static readonly rawName = 'CSBd'
	static readonly minimumVersion = ProtocolVersion.V8_0

	readonly ssrcId: number

	constructor (ssrcId: number) {
		super()

		this.ssrcId = ssrcId
	}

	serialize () {
		const buffer = Buffer.alloc(24)

		buffer.writeUInt16BE(this.flag, 0)
		buffer.writeUInt8(this.ssrcId, 2)

		buffer.writeUInt8(this.properties.borderEnabled ? 1 : 0, 3)
		buffer.writeUInt8(this.properties.borderBevel || 0, 4)
		buffer.writeUInt16BE(this.properties.borderOuterWidth || 0, 6)
		buffer.writeUInt16BE(this.properties.borderInnerWidth || 0, 8)
		buffer.writeUInt8(this.properties.borderOuterSoftness || 0, 10)
		buffer.writeUInt8(this.properties.borderInnerSoftness || 0, 11)
		buffer.writeUInt8(this.properties.borderBevelSoftness || 0, 12)
		buffer.writeUInt8(this.properties.borderBevelPosition || 0, 13)
		buffer.writeUInt16BE(this.properties.borderHue || 0, 14)
		buffer.writeUInt16BE(this.properties.borderSaturation || 0, 16)
		buffer.writeUInt16BE(this.properties.borderLuma || 0, 18)
		buffer.writeUInt16BE(this.properties.borderLightSourceDirection || 0, 20)
		buffer.writeUInt8(this.properties.borderLightSourceAltitude || 0, 22)

		return buffer
	}
}

export class SuperSourcePropertiesUpdateCommand extends DeserializedCommand<Pick<SuperSource, 'properties' | 'border'>> {
	static readonly rawName = 'SSrc'

	static deserialize (rawCommand: Buffer): SuperSourcePropertiesUpdateCommand {
		const properties = {
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

		return new SuperSourcePropertiesUpdateCommand(properties)
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

export class SuperSourcePropertiesUpdateV8Command extends DeserializedCommand<SuperSourceProperties> {
	static readonly rawName = 'SSrc'
	static readonly minimumVersion = ProtocolVersion.V8_0

	readonly ssrcId: number

	constructor (ssrcId: number, properties: SuperSourceProperties) {
		super(properties)

		this.ssrcId = ssrcId
	}

	static deserialize (rawCommand: Buffer): SuperSourcePropertiesUpdateV8Command {
		const ssrcId = rawCommand.readUInt8(0)
		const properties = {
			artFillSource: rawCommand.readUInt16BE(2),
			artCutSource: rawCommand.readUInt16BE(4),
			artOption: Util.parseEnum<Enums.SuperSourceArtOption>(rawCommand.readUInt8(6), Enums.SuperSourceArtOption),
			artPreMultiplied: rawCommand[7] === 1,
			artClip: Util.parseNumberBetween(rawCommand.readUInt16BE(8), 0, 1000),
			artGain: Util.parseNumberBetween(rawCommand.readUInt16BE(10), 0, 1000),
			artInvertKey: rawCommand[12] === 1
		}

		return new SuperSourcePropertiesUpdateV8Command(ssrcId, properties)
	}

	applyToState (state: AtemState) {
		const supersource = state.video.getSuperSource(this.ssrcId)
		supersource.properties = {
			...this.properties
		}
		return `video.superSources.${this.ssrcId}.properties`
	}
}

export class SuperSourceBorderUpdateCommand extends DeserializedCommand<SuperSourceBorder> {
	static readonly rawName = 'SSBd'
	static readonly minimumVersion = ProtocolVersion.V8_0

	readonly ssrcId: number

	constructor (ssrcId: number, properties: SuperSourceBorder) {
		super(properties)

		this.ssrcId = ssrcId
	}

	static deserialize (rawCommand: Buffer) {
		const ssrcId = rawCommand.readUInt8(0)
		const properties = {
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

		return new SuperSourceBorderUpdateCommand(ssrcId, properties)
	}

	applyToState (state: AtemState) {
		const supersource = state.video.getSuperSource(this.ssrcId)
		supersource.border = {
			...this.properties
		}
		return `video.superSources.${this.ssrcId}.border`
	}
}
