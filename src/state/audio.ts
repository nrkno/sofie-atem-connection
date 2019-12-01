import { AudioSourceType, ExternalPortType, AudioMixOption } from '../enums'

export interface AudioChannel {
	readonly sourceType: AudioSourceType
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
	public numberOfChannels?: number
	public hasMonitor?: boolean
	public channels: Array<AudioChannel | undefined> = []
	public master?: AudioMasterChannel
}
