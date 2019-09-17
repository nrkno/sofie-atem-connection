import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { UpstreamKeyerBase } from '../../../state/video/upstreamKeyers'
import { Util, Enums } from '../../..'

export class MixEffectKeyPropertiesGetCommand extends AbstractCommand {
	rawName = 'KeBP'
	mixEffect: number
	properties: UpstreamKeyerBase

	deserialize (rawCommand: Buffer) {
		this.mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		this.properties = {
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
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		Object.assign(
			mixEffect.upstreamKeyers[this.properties.upstreamKeyerId],
			this.properties
		)
		return `video.ME.${this.mixEffect}.upstreamKeyers.${this.properties.upstreamKeyerId}`
	}
}
