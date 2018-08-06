import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { UpstreamKeyerFlyKeyframe } from '../../../state/video/upstreamKeyers'
import { Util } from '../../..'

export class MixEffectKeyFlyKeyframeGetCommand extends AbstractCommand {
	rawName = 'KKFP'
	mixEffect: number
	upstreamKeyerId: number
	properties: UpstreamKeyerFlyKeyframe

	deserialize (rawCommand: Buffer) {
		this.mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		this.upstreamKeyerId = Util.parseNumberBetween(rawCommand[1], 0, 3)
		this.properties = {
			keyFrameId: Util.parseNumberBetween(rawCommand[2], 0, 1),

			sizeX: Util.parseNumberBetween(rawCommand.readUInt32BE(4), 0, 99990),
			sizeY: Util.parseNumberBetween(rawCommand.readUInt32BE(8), 0, 99990),
			positionX: Util.parseNumberBetween(rawCommand.readInt32BE(12), -1000 * 1000, 1000 * 1000),
			positionY: Util.parseNumberBetween(rawCommand.readInt32BE(16), -1000 * 1000, 1000 * 1000),
			rotation: Util.parseNumberBetween(rawCommand.readInt32BE(20), -332230, 332230),

			borderOuterWidth: Util.parseNumberBetween(rawCommand.readUInt16BE(24), 0, 1600),
			borderInnerWidth: Util.parseNumberBetween(rawCommand.readUInt16BE(26), 0, 1600),
			borderOuterSoftness: Util.parseNumberBetween(rawCommand.readInt8(28), 0, 100),
			borderInnerSoftness: Util.parseNumberBetween(rawCommand.readInt8(29), 0, 100),
			borderBevelSoftness: Util.parseNumberBetween(rawCommand.readInt8(30), 0, 100),
			borderBevelPosition: Util.parseNumberBetween(rawCommand.readInt8(31), 0, 100),

			borderOpacity: Util.parseNumberBetween(rawCommand.readInt8(32), 0, 100),
			borderHue: Util.parseNumberBetween(rawCommand.readUInt16BE(34), 0, 1000),
			borderSaturation: Util.parseNumberBetween(rawCommand.readUInt16BE(36), 0, 1000),
			borderLuma: Util.parseNumberBetween(rawCommand.readUInt16BE(38), 0, 1000),

			lightSourceDirection: Util.parseNumberBetween(rawCommand.readUInt16BE(40), 0, 3599),
			lightSourceAltitude: Util.parseNumberBetween(rawCommand.readUInt8(42), 0, 100),

			maskEnabled: rawCommand[43] === 1,
			maskTop: Util.parseNumberBetween(rawCommand.readUInt16BE(44), 0, 38000),
			maskBottom: Util.parseNumberBetween(rawCommand.readUInt16BE(46), 0, 38000),
			maskLeft: Util.parseNumberBetween(rawCommand.readUInt16BE(48), 0, 52000),
			maskRight: Util.parseNumberBetween(rawCommand.readUInt16BE(50), 0, 52000)
		}
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId)
		upstreamKeyer.flyKeyframes[this.properties.keyFrameId] = {
			...this.properties
		}
	}
}
