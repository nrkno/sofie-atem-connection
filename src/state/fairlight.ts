import {
	FairlightAudioMixOption,
	FairlightInputConfiguration,
	FairlightAnalogInputLevel,
	FairlightAudioSourceType,
	ExternalPortType,
	FairlightInputType,
	AudioChannelPair,
	AudioInternalPortType
} from '../enums'

// export interface FairlightAudioMasterChannel {
// 	equalizerEnabled: boolean
// 	equalizerGain: number
// 	makeUpGain: number
// 	/** Gain in decibel, -Infinity to +6dB */
// 	faderGain: number
// 	followFadeToBlack: boolean
// }

export interface FairlightAudioSource {
	properties?: FairlightAudioSourceProperties
}
export interface FairlightAudioSourceProperties {
	readonly sourceType: FairlightAudioSourceType

	readonly maxFramesDelay: number
	framesDelay: number

	// TODO - mono vs stereo

	gain: number

	readonly hasStereoSimulation: boolean
	stereoSimulation: number

	readonly equalizerBands: number
	equalizerEnabled: boolean
	equalizerGain: number
	makeUpGain: number
	balance: number
	faderGain: number

	readonly supportedMixOptions: FairlightAudioMixOption[]
	mixOption: FairlightAudioMixOption
}

export interface FairlightAudioInput {
	properties?: FairlightAudioInputProperties
	sources: { [sourceId: string]: FairlightAudioSource | undefined }
}

export interface FairlightAudioInputProperties {
	readonly inputType: FairlightInputType
	readonly externalPortType: ExternalPortType

	readonly supportedConfigurations: FairlightInputConfiguration[]
	activeConfiguration: FairlightInputConfiguration

	readonly supportedInputLevels: FairlightAnalogInputLevel[]
	activeInputLevel: FairlightAnalogInputLevel
}

export interface FairlightAudioRoutingSource {
	readonly audioSourceId: number
	readonly audioChannelPair: AudioChannelPair

	readonly externalPortType: ExternalPortType
	readonly internalPortType: AudioInternalPortType

	name: string
}

export interface FairlightAudioRoutingOutput {
	readonly audioOutputId: number
	readonly audioChannelPair: AudioChannelPair

	readonly externalPortType: ExternalPortType
	readonly internalPortType: AudioInternalPortType

	sourceId: number
	name: string
}

export interface FairlightAudioRouting {
	sources: Record<number, FairlightAudioRoutingSource>
	outputs: Record<number, FairlightAudioRoutingOutput>
}

export interface AtemFairlightAudioState {
	inputs: { [input: number]: FairlightAudioInput | undefined }
	// master?: FairlightAudioMasterChannel

	audioRouting?: FairlightAudioRouting
}
