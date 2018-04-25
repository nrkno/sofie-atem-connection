import { DVEEffect, TransitionStyle } from '../enums'

export interface DownstreamKeyer {
	onAir: boolean
	inTransition: boolean
	isAuto: boolean
	remainingFrames: number
}

export interface DipTransitionSettings {
	rate: number
	input: number
}

export interface TransitionSettings {
	dip: DipTransitionSettings
	DVE: {
		rate: number
		logoRate: number
		style: DVEEffect
		fillSource: number
		keySource: number

		enableKey: boolean
		preMultiplied: boolean
		clip: number
		gain: number
		invertKey: boolean
		reverse: boolean
		flipFlop: boolean
	}
	mix: {
		rate: number
	}
	stinger: {
		source: number
		preMultipliedKey: boolean

		clip: number
		gain: number // 0...1000
		invert: boolean

		preroll: number
		clipDuration: number
		triggerPoint: number
		mixRate: number
	}
	wipe: {
		rate: number
		pattern: number
		borderWidth: number
		borderInput: number
		symmetry: number
		borderSoftness: number
		xPosition: number
		yPosition: number
		reverseDirection: boolean
		flipFlop: boolean
	}
}

export interface MixEffect {
	programInput: number
	previewInput: number
	inTransition: boolean
	transitionPreview: boolean
	transitionPosition: number
	transitionFramesLeft: number
	fadeToBlack: boolean
	numberOfKeyers: number
	transitionProperties: {
		style: TransitionStyle,
		selection: number,
		nextStyle: TransitionStyle,
		nextSelection: number
	}
	transitionSettings: TransitionSettings
}

export class AtemVideoState {
	ME: Array<MixEffect> = []
	downstreamKeyers: Array<DownstreamKeyer> = []
	auxilliaries: Array<number> = []

	getMe (index: number) {
		if (!this.ME[index]) {
			this.ME[index] = {} as MixEffect
		}

		return this.ME[index]
	}
}
