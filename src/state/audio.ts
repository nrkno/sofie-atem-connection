import { AudioSourceType, ExternalPortType, AudioMixOption } from '../enums'

export interface AudioChannel {
	readonly sourceType: AudioSourceType
	portType: ExternalPortType
	mixOption: AudioMixOption
	/** Gain in decibel, -Infinity to +6dB */
	gain: number
	/** Balance, -50 to +50 */
	balance: number

	readonly supportsRcaToXlrEnabled: boolean
	rcaToXlrEnabled: boolean
}

export interface AudioMasterChannel {
	/** Gain in decibel, -Infinity to +6dB */
	gain: number
	/** Balance, -50 to +50 */
	balance: number
	followFadeToBlack: boolean
}

export interface AtemAudioState {
	numberOfChannels?: number
	hasMonitor?: boolean
	channels: { [channelId: number]: AudioChannel | undefined }
	master?: AudioMasterChannel
}
