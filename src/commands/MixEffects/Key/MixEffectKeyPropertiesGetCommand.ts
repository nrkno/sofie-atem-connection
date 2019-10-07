import { DeserializedCommand } from '../../CommandBase'
import { AtemState } from '../../../state'
import { UpstreamKeyerBase } from '../../../state/video/upstreamKeyers'
import { Util, Enums } from '../../..'

export class MixEffectKeyPropertiesGetCommand extends DeserializedCommand<UpstreamKeyerBase> {
	static readonly rawName = 'KeBP'

	readonly mixEffect: number

	constructor (mixEffect: number, properties: UpstreamKeyerBase) {
		super(properties)

		this.mixEffect = mixEffect
	}

	static deserialize (rawCommand: Buffer): MixEffectKeyPropertiesGetCommand {
		const mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		const properties = {
			upstreamKeyerId: Util.parseNumberBetween(rawCommand[1], 0, 3),
			mixEffectKeyType: Util.parseEnum<Enums.MixEffectKeyType>(rawCommand[2], Enums.MixEffectKeyType),
			flyEnabled: rawCommand[5] === 1,
			fillSource: rawCommand.readUInt16BE(6),
			cutSource: rawCommand.readUInt16BE(8),
			maskEnabled: rawCommand[10] === 1,
			maskTop: Util.parseNumberBetween(rawCommand.readInt16BE(12), -9000, 9000),
			maskBottom: Util.parseNumberBetween(rawCommand.readInt16BE(14), -9000, 9000),
			maskLeft: Util.parseNumberBetween(rawCommand.readInt16BE(16), -16000, 16000),
			maskRight: Util.parseNumberBetween(rawCommand.readInt16BE(18), -16000, 16000)
		}

		return new MixEffectKeyPropertiesGetCommand(mixEffect, properties)
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.upstreamKeyers[this.properties.upstreamKeyerId] = {
			...mixEffect.getUpstreamKeyer(this.properties.upstreamKeyerId),
			...this.properties
		}
		return `video.ME.${this.mixEffect}.upstreamKeyers.${this.properties.upstreamKeyerId}`
	}
}
