import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { AudioMixerInfo } from '../../state/info'

export class AudioMixerConfigCommand extends DeserializedCommand<AudioMixerInfo> {
	public static readonly rawName = '_AMC'

	constructor (properties: AudioMixerInfo) {
		super(properties)
	}

	public static deserialize (rawCommand: Buffer): AudioMixerConfigCommand {
		return new AudioMixerConfigCommand({
			inputs: rawCommand.readUInt8(0),
			monitors: rawCommand.readUInt8(1)
		})
	}

	public applyToState (state: AtemState) {
		state.info.audioMixer = this.properties
		return `info.audioMixer`
	}
}
