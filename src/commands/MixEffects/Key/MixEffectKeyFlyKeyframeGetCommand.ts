import { DeserializedCommand } from '../../CommandBase'
import { AtemState } from '../../../state'
import { UpstreamKeyerFlyKeyframe } from '../../../state/video/upstreamKeyers'
import { Util } from '../../..'

export class MixEffectKeyFlyKeyframeGetCommand extends DeserializedCommand<UpstreamKeyerFlyKeyframe> {
	static readonly rawName = 'KKFP'

	readonly mixEffect: number
	readonly upstreamKeyerId: number
	readonly keyFrameId: number

	constructor (mixEffect: number, upstreamKeyerId: number, keyFrameId: number, properties: UpstreamKeyerFlyKeyframe) {
		super(properties)

		this.mixEffect = mixEffect
		this.upstreamKeyerId = upstreamKeyerId
		this.keyFrameId = keyFrameId
	}

	static deserialize (rawCommand: Buffer) {
		const mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		const upstreamKeyerId = Util.parseNumberBetween(rawCommand[1], 0, 3)
		const keyFrameId = Util.parseNumberBetween(rawCommand[2], 1, 2)
		const properties = {
			keyFrameId: keyFrameId,

			// Note: these are higher than the ui shows, but are within the range the atem can be set to
			sizeX: Util.parseNumberBetween(rawCommand.readUInt32BE(4), 0, Math.pow(2, 32) - 1),
			sizeY: Util.parseNumberBetween(rawCommand.readUInt32BE(8), 0, Math.pow(2, 32) - 1),

			positionX: Util.parseNumberBetween(rawCommand.readInt32BE(12), -32768 * 1000, 32768 * 1000),
			positionY: Util.parseNumberBetween(rawCommand.readInt32BE(16), -32768 * 1000, 32768 * 1000),
			rotation: Util.parseNumberBetween(rawCommand.readInt32BE(20), -332230, 332230),

			borderOuterWidth: Util.parseNumberBetween(rawCommand.readUInt16BE(24), 0, 65535),
			borderInnerWidth: Util.parseNumberBetween(rawCommand.readUInt16BE(26), 0, 65535),
			borderOuterSoftness: Util.parseNumberBetween(rawCommand.readUInt8(28), 0, 255),
			borderInnerSoftness: Util.parseNumberBetween(rawCommand.readUInt8(29), 0, 255),
			borderBevelSoftness: Util.parseNumberBetween(rawCommand.readUInt8(30), 0, 255),
			borderBevelPosition: Util.parseNumberBetween(rawCommand.readUInt8(31), 0, 255),

			borderOpacity: Util.parseNumberBetween(rawCommand.readUInt8(32), 0, 255),
			borderHue: Util.parseNumberBetween(rawCommand.readUInt16BE(34), 0, 65535),
			borderSaturation: Util.parseNumberBetween(rawCommand.readUInt16BE(36), 0, 65535),
			borderLuma: Util.parseNumberBetween(rawCommand.readUInt16BE(38), 0, 65535),

			lightSourceDirection: Util.parseNumberBetween(rawCommand.readUInt16BE(40), 0, 65535),
			lightSourceAltitude: Util.parseNumberBetween(rawCommand.readUInt8(42), 0, 254),

			maskEnabled: rawCommand[43] === 1,
			maskTop: Util.parseNumberBetween(rawCommand.readInt16BE(44), -9000, 9000),
			maskBottom: Util.parseNumberBetween(rawCommand.readInt16BE(46), -9000, 9000),
			maskLeft: Util.parseNumberBetween(rawCommand.readInt16BE(48), -16000, 16000),
			maskRight: Util.parseNumberBetween(rawCommand.readInt16BE(50), -16000, 16000)
		}

		return new MixEffectKeyFlyKeyframeGetCommand(mixEffect, upstreamKeyerId, keyFrameId, properties)
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId)
		upstreamKeyer.flyKeyframes[this.properties.keyFrameId] = {
			...this.properties
		}
		return `video.ME.${this.mixEffect}.upstreamKeyers.${this.upstreamKeyerId}.flyKeyframes.${this.properties.keyFrameId}`
	}
}
