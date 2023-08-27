export type SomeAtemAudioLevels = FairlightAudioSourceLevels | FairlightAudioMasterLevels

export interface AtemAudioLevelsBase<T extends string> {
	system: 'fairlight'
	type: T
}
export interface FairlightAudioSourceLevels extends AtemAudioLevelsBase<'source'> {
	index: number
	source: bigint

	levels: FairlightAudioLevels
}

export interface FairlightAudioMasterLevels extends AtemAudioLevelsBase<'master'> {
	levels: Omit<FairlightAudioLevels, 'expanderGainReduction'>
}

export interface FairlightAudioLevels {
	inputLeftLevel: number
	inputRightLevel: number
	inputLeftPeak: number
	inputRightPeak: number

	expanderGainReduction: number
	compressorGainReduction: number
	limiterGainReduction: number

	outputLeftLevel: number
	outputRightLevel: number
	outputLeftPeak: number
	outputRightPeak: number

	leftLevel: number
	rightLevel: number
	leftPeak: number
	rightPeak: number
}
