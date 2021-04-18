import {
	FairlightAudioMixOption,
	FairlightInputConfiguration,
	FairlightAnalogInputLevel,
	FairlightAudioSourceType,
	ExternalPortType,
	FairlightInputType
} from '../enums'

export interface FairlightAudioDynamicsState {
	// makeUpGain: number

	limiter?: FairlightAudioLimiterState
	compressor?: FairlightAudioCompressorState
	expander?: FairlightAudioExpanderState
}

export interface FairlightAudioLimiterState {
	limiterEnabled: boolean
	threshold: number
	attack: number
	hold: number
	release: number
}

export interface FairlightAudioCompressorState {
	compressorEnabled: boolean
	threshold: number
	ratio: number
	attack: number
	hold: number
	release: number
}

export interface FairlightAudioExpanderState {
	expanderEnabled: boolean
	gateEnabled: boolean
	threshold: number
	range: number
	ratio: number
	attack: number
	hold: number
	release: number
}

export interface FairlightAudioEqualizerBandState {
	bandEnabled: boolean

	readonly supportedShapes: number[] // TODO
	shape: number // TODO

	readonly supportedFrequencyRanges: number[] // TODO
	frequencyRange: number // TODO

	frequency: number

	gain: number
	qFactor: number
}

export interface FairlightAudioMasterChannel {
	equalizerEnabled: boolean
	equalizerGain: number
	readonly equalizerBands: Array<FairlightAudioEqualizerBandState | undefined>

	makeUpGain: number
	/** Gain in decibel, -Infinity to +6dB */
	faderGain: number
	followFadeToBlack: boolean

	dynamics?: Omit<FairlightAudioDynamicsState, 'expander'>
}

export interface FairlightAudioMonitorChannel {
	gain: number
	inputMasterGain: number
	inputTalkbackGain: number
	inputSidetoneGain: number
}

export interface FairlightAudioSource {
	properties?: FairlightAudioSourceProperties

	dynamics?: FairlightAudioDynamicsState
}
export interface FairlightAudioSourceProperties {
	readonly sourceType: FairlightAudioSourceType

	readonly maxFramesDelay: number
	framesDelay: number

	readonly hasStereoSimulation: boolean
	stereoSimulation: number

	gain: number
	balance: number
	faderGain: number

	equalizerEnabled: boolean
	equalizerGain: number
	readonly equalizerBands: Array<FairlightAudioEqualizerBandState | undefined>

	makeUpGain: number

	readonly supportedMixOptions: FairlightAudioMixOption[]
	mixOption: FairlightAudioMixOption
}

export interface FairlightAudioInput {
	properties?: FairlightAudioInputProperties
	sources: { [sourceId: string]: FairlightAudioSource | undefined }

	// analog?: FairlightAudioInputAnalog
}

// export interface FairlightAudioInputAnalog {
// 	readonly supportedInputLevels: FairlightAnalogInputLevel[]
// 	inputLevel: FairlightAnalogInputLevel
// }

export interface FairlightAudioInputProperties {
	readonly inputType: FairlightInputType
	readonly externalPortType: ExternalPortType

	readonly supportedConfigurations: FairlightInputConfiguration[]
	activeConfiguration: FairlightInputConfiguration

	readonly supportedInputLevels: FairlightAnalogInputLevel[]
	activeInputLevel: FairlightAnalogInputLevel
}

export interface AtemFairlightAudioState {
	inputs: { [input: number]: FairlightAudioInput | undefined }
	master?: FairlightAudioMasterChannel
	monitor?: FairlightAudioMonitorChannel

	audioFollowVideoCrossfadeTransitionEnabled?: boolean
}
