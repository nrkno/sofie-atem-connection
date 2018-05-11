import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { UpstreamKeyerDVESettings } from '../../../state/video/upstreamKeyers'

export class MixEffectKeyDVECommand extends AbstractCommand {
	rawName = 'KeDV'
	mixEffect: number
	upstreamKeyerId: number
	properties: UpstreamKeyerDVESettings
	MaskFlags = {
		sizeX: 1 << 0,
		sizeY: 1 << 1,
		positionX: 1 << 2,
		positionY: 1 << 3,
		rotation: 1 << 4,
		borderEnabled: 1 << 5,
		shadowEnabled: 1 << 6,
		borderBevel: 1 << 7,
		borderOuterWidth: 1 << 8,
		borderInnerWidth: 1 << 9,
		borderOuterSoftness: 1 << 10,
		borderInnerSoftness: 1 << 11,
		borderBevelSoftness: 1 << 12,
		borderBevelPosition: 1 << 13,
		borderOpacity: 1 << 14,
		borderHue: 1 << 15,
		borderSaturation: 1 << 16,
		borderLuma: 1 << 17,
		lightSourceDirection: 1 << 18,
		lightSourceAltitude: 1 << 19,
		maskEnabled: 1 << 20,
		maskTop: 1 << 21,
		maskBottom: 1 << 22,
		maskLeft: 1 << 23,
		maskRight: 1 << 24,
		rate: 1 << 25
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
		this.upstreamKeyerId = rawCommand[1]
		this.properties = {
			sizeX: rawCommand.readUInt32BE(4),
			sizeY: rawCommand.readUInt32BE(8),
			positionX: rawCommand.readInt32BE(12),
			positionY: rawCommand.readInt32BE(16),
			rotation: rawCommand.readInt32BE(20),

			borderEnabled: rawCommand[24] === 1,
			shadowEnabled: rawCommand[25] === 1,
			borderBevel: rawCommand.readUInt8(26),
			borderOuterWidth: rawCommand.readUInt16BE(28),
			borderInnerWidth: rawCommand.readUInt16BE(30),
			borderOuterSoftness: rawCommand.readInt8(32),
			borderInnerSoftness: rawCommand.readInt8(33),
			borderBevelSoftness: rawCommand.readInt8(34),
			borderBevelPosition: rawCommand.readInt8(35),

			borderOpacity: rawCommand.readInt8(36),
			borderHue: rawCommand.readUInt16BE(38),
			borderSaturation: rawCommand.readUInt16BE(40),
			borderLuma: rawCommand.readUInt16BE(42),

			lightSourceDirection: rawCommand.readUInt16BE(44),
			lightSourceAltitude: rawCommand.readUInt8(46),

			maskEnabled: rawCommand[47] === 1,
			maskTop: rawCommand.readUInt16BE(48),
			maskBottom: rawCommand.readUInt16BE(50),
			maskLeft: rawCommand.readUInt16BE(52),
			maskRight: rawCommand.readUInt16BE(54),

			rate: rawCommand.readInt8(56)
		}
	}

	serialize () {
		const buffer = Buffer.alloc(64)
		buffer.writeUInt32BE(this.flag, 0)
		buffer.writeUInt8(this.mixEffect, 4)
		buffer.writeUInt8(this.upstreamKeyerId, 5)

		buffer.writeUInt32BE(this.properties.sizeX, 8)
		buffer.writeUInt32BE(this.properties.sizeY, 12)
		buffer.writeInt32BE(this.properties.positionX, 16)
		buffer.writeInt32BE(this.properties.positionY, 20)
		buffer.writeInt32BE(this.properties.rotation, 24)

		buffer[28] = this.properties.borderEnabled ? 1 : 0
		buffer[29] = this.properties.shadowEnabled ? 1 : 0
		buffer.writeUInt8(this.properties.borderBevel, 30)
		buffer.writeUInt16BE(this.properties.borderOuterWidth, 32)
		buffer.writeUInt16BE(this.properties.borderInnerWidth, 34)
		buffer.writeUInt8(this.properties.borderOuterSoftness, 36)
		buffer.writeUInt8(this.properties.borderInnerSoftness, 37)
		buffer.writeUInt8(this.properties.borderBevelSoftness, 38)
		buffer.writeUInt8(this.properties.borderBevelPosition, 39)
		buffer.writeUInt8(this.properties.borderOpacity, 40)

		buffer.writeUInt16BE(this.properties.borderHue, 42)
		buffer.writeUInt16BE(this.properties.borderSaturation, 44)
		buffer.writeUInt16BE(this.properties.borderLuma, 46)

		buffer.writeUInt16BE(this.properties.lightSourceDirection, 48)
		buffer.writeUInt8(this.properties.lightSourceAltitude, 50)

		buffer[51] = this.properties.maskEnabled ? 1 : 0
		buffer.writeUInt16BE(this.properties.maskTop, 52)
		buffer.writeUInt16BE(this.properties.maskBottom, 54)
		buffer.writeUInt16BE(this.properties.maskLeft, 56)
		buffer.writeUInt16BE(this.properties.maskRight, 58)

		buffer.writeUInt8(this.properties.rate, 60)

		return Buffer.concat([Buffer.from('CKDV', 'ascii'), buffer])
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId)
		upstreamKeyer.dveSettings = {
			...this.properties
		}
	}
}
