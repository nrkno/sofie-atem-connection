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

export interface DVETransitionSettings {
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

export interface MixTransitionSettings {
	rate: number // 0...250
}

export interface StingerTransitionSettings {
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

export interface WipeTransitionSettings {
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

export interface TransitionProperties {
	style: TransitionStyle,
	selection: number,
	readonly nextStyle: TransitionStyle,
	readonly nextSelection: number
}

export interface TransitionSettings {
	dip: DipTransitionSettings
	DVE: DVETransitionSettings
	mix: MixTransitionSettings
	stinger: StingerTransitionSettings
	wipe: WipeTransitionSettings
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
	transitionProperties: TransitionProperties
	transitionSettings: TransitionSettings
}

export interface SuperSourceBox {
	enabled: boolean
	source: number
	x: number
	y: number
	size: number
	cropped: boolean
	cropTop: number
	cropBottom: number
	cropLeft: number
	cropRight: number
}

export class AtemVideoState {
	ME: Array<MixEffect> = []
	downstreamKeyers: Array<DownstreamKeyer> = []
	auxilliaries: Array<number> = []
	superSourceBoxes: Array<SuperSourceBox> = []

	getMe (index: number) {
		if (!this.ME[index]) {
			this.ME[index] = {
				transitionProperties: {} as TransitionProperties,
				transitionSettings: {} as TransitionSettings
			} as MixEffect
		}

		return this.ME[index]
	}
}
