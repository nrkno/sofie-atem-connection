import { AudioSourceType, ExternalPortType, AudioMixOption } from '../enums'

export class AudioChannel {
	sourceType: AudioSourceType
	portType: ExternalPortType
	mixOption: AudioMixOption
	gain: number
	balance: number
}

export class AtemAudioState {
	numberOfChannels: number
	hasMonitor: boolean
	channels: Array<AudioChannel> = []
	master: AudioChannel = new AudioChannel()

	getChannel (index: number) {
		if (!this.channels[index]) {
			this.channels[index] = new AudioChannel()
		}
		return this.channels[index]
	}
}
