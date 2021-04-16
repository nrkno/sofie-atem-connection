import { FairlightAudioMasterChannel } from '../../state/fairlight'
import { AtemState, InvalidIdError } from '../../state'
import { DeserializedCommand, WritableCommand } from '../CommandBase'
import { OmitReadonly } from '../../lib/types'
import * as Util from '../../lib/atemUtil'

export class FairlightMixerMasterCommand extends WritableCommand<OmitReadonly<FairlightAudioMasterChannel>> {
	public static MaskFlags = {
		equalizerEnabled: 1 << 0,
		equalizerGain: 1 << 1,
		makeUpGain: 1 << 2,
		faderGain: 1 << 3,
		followFadeToBlack: 1 << 4
	}

	public static readonly rawName = 'CFMP'

	public serialize(): Buffer {
		const buffer = Buffer.alloc(20)
		buffer.writeUInt8(this.flag, 0)

		buffer.writeUInt8(this.properties.equalizerEnabled ? 1 : 0, 1)
		buffer.writeInt32BE(this.properties.equalizerGain || 0, 4)
		buffer.writeInt32BE(this.properties.makeUpGain || 0, 8)
		buffer.writeInt32BE(this.properties.faderGain || 0, 12)
		buffer.writeUInt8(this.properties.followFadeToBlack ? 1 : 0, 16)
		return buffer
	}
}

export class FairlightMixerMasterUpdateCommand extends DeserializedCommand<
	Omit<FairlightAudioMasterChannel, 'equalizerBands'> & { bandCount: number }
> {
	public static readonly rawName = 'FAMP'

	public static deserialize(rawCommand: Buffer): FairlightMixerMasterUpdateCommand {
		const properties = {
			bandCount: rawCommand.readUInt8(0),
			equalizerEnabled: rawCommand.readUInt8(1) > 0,
			equalizerGain: rawCommand.readInt32BE(4),
			makeUpGain: rawCommand.readInt32BE(8),
			faderGain: rawCommand.readInt32BE(12),
			followFadeToBlack: rawCommand.readUInt8(16) > 0
		}

		return new FairlightMixerMasterUpdateCommand(properties)
	}

	public applyToState(state: AtemState): string {
		if (!state.fairlight) {
			throw new InvalidIdError('Fairlight')
		}

		state.fairlight.master = {
			// default bands to empty
			equalizerBands: new Array(this.properties.bandCount).fill(undefined),
			// preserve old bands
			...state.fairlight.master,
			...Util.omit(this.properties, 'bandCount')
		}

		return `fairlight.master`
	}
}
