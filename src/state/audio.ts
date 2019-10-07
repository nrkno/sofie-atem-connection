import { AudioSourceType, ExternalPortType, AudioMixOption } from '../enums'

export interface AudioChannel {
	sourceType: AudioSourceType
	portType: ExternalPortType
	mixOption: AudioMixOption
	/** Gain in decibel, -Infinity to +6dB */
	gain: number
	/** Balance, -50 to +50 */
	balance: number
}

export interface AudioMasterChannel {
	/** Gain in decibel, -Infinity to +6dB */
	gain: number
	/** Balance, -50 to +50 */
	balance: number
	followFadeToBlack: boolean
}

export class AtemAudioState {
	numberOfChannels?: number
	hasMonitor?: boolean
	channels: Array<AudioChannel | undefined> = []
	master?: AudioMasterChannel
}
