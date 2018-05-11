import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { UpstreamKeyerBase } from '../../../state/video/upstreamKeyers'

export class MixEffectKeyPropertiesGetCommand extends AbstractCommand {
	rawName = 'KeBP'
	mixEffect: number
	properties: UpstreamKeyerBase

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
		this.properties = {
			upstreamKeyerId: rawCommand[1],
			mixEffectKeyType: rawCommand[2],
			flyEnabled: rawCommand[5] === 1,
			fillSource: rawCommand.readUInt16BE(6),
			cutSource: rawCommand.readUInt16BE(8),
			maskEnabled: rawCommand[10] === 1,
			maskTop: rawCommand.readInt16BE(12),
			maskBottom: rawCommand.readInt16BE(14),
			maskLeft: rawCommand.readInt16BE(16),
			maskRight: rawCommand.readInt16BE(18)
		}
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		Object.assign(
			mixEffect.upstreamKeyers[this.properties.upstreamKeyerId],
			this.properties
		)
	}
}
