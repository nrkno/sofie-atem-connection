import { DeserializedCommand } from '../../CommandBase'
import { AtemState } from '../../../state'
import { UpstreamKeyerBase } from '../../../state/video/upstreamKeyers'

export class MixEffectKeyPropertiesGetCommand extends DeserializedCommand<UpstreamKeyerBase> {
	public static readonly rawName = 'KeBP'

	public readonly mixEffect: number

	constructor (mixEffect: number, properties: UpstreamKeyerBase) {
		super(properties)

		this.mixEffect = mixEffect
	}

	public static deserialize (rawCommand: Buffer): MixEffectKeyPropertiesGetCommand {
		const mixEffect = rawCommand[0]
		const properties = {
			upstreamKeyerId: rawCommand[1],
			mixEffectKeyType: rawCommand.readUInt8(2),
			flyEnabled: rawCommand[5] === 1,
			fillSource: rawCommand.readUInt16BE(6),
			cutSource: rawCommand.readUInt16BE(8),
			maskEnabled: rawCommand[10] === 1,
			maskTop: rawCommand.readInt16BE(12),
			maskBottom: rawCommand.readInt16BE(14),
			maskLeft: rawCommand.readInt16BE(16),
			maskRight: rawCommand.readInt16BE(18)
		}

		return new MixEffectKeyPropertiesGetCommand(mixEffect, properties)
	}

	public applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.upstreamKeyers[this.properties.upstreamKeyerId] = {
			...mixEffect.getUpstreamKeyer(this.properties.upstreamKeyerId),
			...this.properties
		}
		return `video.ME.${this.mixEffect}.upstreamKeyers.${this.properties.upstreamKeyerId}`
	}
}
