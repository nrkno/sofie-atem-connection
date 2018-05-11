import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { UpstreamKeyerFlyKeyframe } from '../../../state/video/upstreamKeyers'

export class MixEffectKeyFlyKeyframeGetCommand extends AbstractCommand {
	rawName = 'KKFP'
	mixEffect: number
	upstreamKeyerId: number
	properties: UpstreamKeyerFlyKeyframe

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
		this.upstreamKeyerId = rawCommand[1]
		this.properties = {
			keyFrameId: rawCommand[2],

			sizeX: rawCommand.readUInt32BE(4),
			sizeY: rawCommand.readUInt32BE(8),
			positionX: rawCommand.readInt32BE(12),
			positionY: rawCommand.readInt32BE(16),
			rotation: rawCommand.readInt32BE(20),

			borderOuterWidth: rawCommand.readUInt16BE(24),
			borderInnerWidth: rawCommand.readUInt16BE(26),
			borderOuterSoftness: rawCommand.readInt8(28),
			borderInnerSoftness: rawCommand.readInt8(29),
			borderBevelSoftness: rawCommand.readInt8(30),
			borderBevelPosition: rawCommand.readInt8(31),

			borderOpacity: rawCommand.readInt8(32),
			borderHue: rawCommand.readUInt16BE(34),
			borderSaturation: rawCommand.readUInt16BE(36),
			borderLuma: rawCommand.readUInt16BE(38),

			lightSourceDirection: rawCommand.readUInt16BE(40),
			lightSourceAltitude: rawCommand.readUInt8(42),

			maskEnabled: rawCommand[43] === 1,
			maskTop: rawCommand.readUInt16BE(44),
			maskBottom: rawCommand.readUInt16BE(46),
			maskLeft: rawCommand.readUInt16BE(48),
			maskRight: rawCommand.readUInt16BE(50)
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
