import { AudioSourceType, ExternalPortType, AudioMixOption } from '../enums'

export class AudioChannel {
	sourceType: AudioSourceType
	portType: ExternalPortType
	mixOption: AudioMixOption
	/** Gain in decibel, -Infinity to +6dB */
	gain: number
	/** Balance, -50 to +50 */
	balance: number
}

export class AudioMasterChannel {
	/** Gain in decibel, -Infinity to +6dB */
	gain: number
	/** Balance, -50 to +50 */
	balance: number
	followFadeToBlack: boolean
}

export class AtemAudioState {
	numberOfChannels: number
	hasMonitor: boolean
	channels: Array<AudioChannel> = []
	master: AudioMasterChannel = new AudioMasterChannel()

	getChannel (index: number) {
		if (!this.channels[index]) {
			this.channels[index] = new AudioChannel()
		}
		return this.channels[index]
	}
}
