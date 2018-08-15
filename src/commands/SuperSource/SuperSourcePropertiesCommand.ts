import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { SuperSourceProperties } from '../../state/video'
import { Util } from '../..'
import { Enums as Enum } from '../..'

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

	rawName = 'SSrc'
	boxId: number
	properties: SuperSourceProperties

	updateProps (newProps: Partial<SuperSourceProperties>) {
		this._updateProps(newProps)
	}

	deserialize (rawCommand: Buffer) {
		this.boxId = rawCommand[0]
		this.properties = {
			artFillSource: rawCommand.readUInt16BE(0),
			artCutSource: rawCommand.readUInt16BE(2),
			artOption: Util.parseEnum<Enum.SuperSourceArtOption>(rawCommand.readUInt8(4), Enum.SuperSourceArtOption),
			artPreMultiplied: rawCommand[5] === 1,
			artClip: Util.parseNumberBetween(rawCommand.readUInt16BE(6), 0, 1000),
			artGain: Util.parseNumberBetween(rawCommand.readUInt16BE(8), 0, 1000),
			artInvertKey: rawCommand[10] === 1,

			borderEnabled: rawCommand[11] === 1,
			borderBevel: Util.parseEnum<Enum.BorderBevel>(rawCommand.readUInt8(12), Enum.BorderBevel),
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

		return Buffer.concat([Buffer.from('CSSc', 'ascii'), buffer])
	}

	applyToState (state: AtemState) {
		state.video.superSourceProperties = {
			...this.properties
		}
	}
}
