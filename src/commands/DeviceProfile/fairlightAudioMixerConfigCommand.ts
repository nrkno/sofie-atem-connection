import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { FairlightAudioMixerInfo } from '../../state/info'

export class FairlightAudioMixerConfigCommand extends DeserializedCommand<FairlightAudioMixerInfo> {
	public static readonly rawName = '_FAC'

	constructor(properties: FairlightAudioMixerInfo) {
		super(properties)
	}

	public static deserialize(rawCommand: Buffer): FairlightAudioMixerConfigCommand {
		return new FairlightAudioMixerConfigCommand({
			inputs: rawCommand.readUInt8(0),
			monitors: rawCommand.readUInt8(1)
		})
	}

	public applyToState(state: AtemState): string {
		state.info.fairlightMixer = this.properties
		state.fairlight = {
			inputs: {}
		}

		return `info.audioMixer`
	}
}
