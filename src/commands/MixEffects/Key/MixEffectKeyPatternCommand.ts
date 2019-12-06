import { WritableCommand, DeserializedCommand } from '../../CommandBase'
import { AtemState } from '../../../state'
import { UpstreamKeyerPatternSettings } from '../../../state/video/upstreamKeyers'

export class MixEffectKeyPatternCommand extends WritableCommand<UpstreamKeyerPatternSettings> {
	public static MaskFlags = {
		style: 1 << 0,
		size: 1 << 1,
		symmetry: 1 << 2,
		softness: 1 << 3,
		positionX: 1 << 4,
		positionY: 1 << 5,
		invert: 1 << 6
	}

	public static readonly rawName = 'CKPt'

	public readonly mixEffect: number
	public readonly upstreamKeyerId: number

	constructor (mixEffect: number, upstreamKeyerId: number) {
		super()

		this.mixEffect = mixEffect
		this.upstreamKeyerId = upstreamKeyerId
	}

	public serialize () {
		const buffer = Buffer.alloc(16)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.upstreamKeyerId, 2)

		buffer.writeUInt8(this.properties.style || 0, 3)
		buffer.writeUInt16BE(this.properties.size || 0, 4)
		buffer.writeUInt16BE(this.properties.symmetry || 0, 6)
		buffer.writeUInt16BE(this.properties.softness || 0, 8)
		buffer.writeUInt16BE(this.properties.positionX || 0, 10)
		buffer.writeUInt16BE(this.properties.positionY || 0, 12)
		buffer.writeUInt8(this.properties.invert ? 1 : 0, 14)

		return buffer
	}
}

export class MixEffectKeyUpdateCommand extends DeserializedCommand<UpstreamKeyerPatternSettings> {
	public static readonly rawName = 'KePt'

	public readonly mixEffect: number
	public readonly upstreamKeyerId: number

	constructor (mixEffect: number, upstreamKeyerId: number, properties: UpstreamKeyerPatternSettings) {
		super(properties)

		this.mixEffect = mixEffect
		this.upstreamKeyerId = upstreamKeyerId
	}

	public static deserialize (rawCommand: Buffer): MixEffectKeyUpdateCommand {
		const mixEffect = rawCommand[0]
		const upstreamKeyerId = rawCommand[1]
		const properties = {
			style: rawCommand.readUInt8(2),
			size: rawCommand.readUInt16BE(4),
			symmetry: rawCommand.readUInt16BE(6),
			softness: rawCommand.readUInt16BE(8),
			positionX: rawCommand.readUInt16BE(10),
			positionY: rawCommand.readUInt16BE(12),
			invert: rawCommand[14] === 1
		}

		return new MixEffectKeyUpdateCommand(mixEffect, upstreamKeyerId, properties)
	}

	public applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId)
		upstreamKeyer.patternSettings = {
			...this.properties
		}
		return `video.ME.${this.mixEffect}.upstreamKeyers.${this.upstreamKeyerId}.patternSettings`
	}
}
