import * as Enum from '../../enums'
import * as USK from './upstreamKeyers'

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
	style: Enum.DVEEffect
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
	style: Enum.TransitionStyle,
	selection: number,
	readonly nextStyle: Enum.TransitionStyle,
	readonly nextSelection: number
}

export interface TransitionSettings {
	dip: DipTransitionSettings
	DVE: DVETransitionSettings
	mix: MixTransitionSettings
	stinger: StingerTransitionSettings
	wipe: WipeTransitionSettings
}

export interface IMixEffect {
	programInput: number
	previewInput: number
	inTransition: boolean
	transitionPreview: boolean
	transitionPosition: number
	transitionFramesLeft: number
	fadeToBlack: boolean
	numberOfKeyers: number
	transitionProperties: TransitionProperties
	transitionSettings: TransitionSettings,
	upstreamKeyers: Array<USK.UpstreamKeyer>
}

export class MixEffect implements IMixEffect {
	index: number
	programInput: number
	previewInput: number
	inTransition: boolean
	transitionPreview: boolean
	transitionPosition: number
	transitionFramesLeft: number
	fadeToBlack: boolean
	numberOfKeyers: number
	transitionProperties: TransitionProperties = {} as TransitionProperties
	transitionSettings: TransitionSettings = {} as TransitionSettings
	upstreamKeyers: Array<USK.UpstreamKeyer> = []

	constructor (index: number) {
		this.index = index
	}

	getUpstreamKeyer (index: number) {
		if (!this.upstreamKeyers[index]) {
			this.upstreamKeyers[index] = {
				dveSettings: {} as USK.UpstreamKeyerDVESettings,
				chromaSettings: {} as USK.UpstreamKeyerChromaSettings,
				lumaSettings: {} as USK.UpstreamKeyerLumaSettings,
				patternSettings: {} as USK.UpstreamKeyerPatternSettings,
				flyKeyframes: [] as Array<USK.UpstreamKeyerFlyKeyframe>,
				flyProperties: {} as USK.UpstreamKeyerFlySettings
			} as USK.UpstreamKeyer
		}

		return this.upstreamKeyers[index]
	}
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
			this.ME[index] = new MixEffect(index)
		}

		return this.ME[index]
	}
}
