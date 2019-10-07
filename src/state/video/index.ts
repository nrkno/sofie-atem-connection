import * as Enum from '../../enums'
import * as USK from './upstreamKeyers'
import { DownstreamKeyer } from './downstreamKeyers'

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
	fadeToBlack: FadeToBlackProperties
	numberOfKeyers: number
	transitionProperties: TransitionProperties
	transitionSettings: TransitionSettings,
	upstreamKeyers: { [index: number]: USK.UpstreamKeyer }
}

export class MixEffect implements IMixEffect {
	index: number
	programInput: number = 0
	previewInput: number = 0
	inTransition: boolean = false
	transitionPreview: boolean = false
	transitionPosition: number = 0
	transitionFramesLeft: number = 0
	fadeToBlack: FadeToBlackProperties
	numberOfKeyers: number = 0
	transitionProperties: TransitionProperties
	transitionSettings: TransitionSettings = {} as any
	upstreamKeyers: { [index: number]: USK.UpstreamKeyer } = []

	constructor (index: number) {
		this.index = index

		this.fadeToBlack = {
			isFullyBlack: false,
			rate: 0,
			inTransition: false,
			remainingFrames: 0
		}
		this.transitionProperties = {
			style: Enum.TransitionStyle.MIX,
			selection: 0,
			nextStyle: Enum.TransitionStyle.MIX,
			nextSelection: 0
		}
	}

	getUpstreamKeyer (index: number) {
		if (!this.upstreamKeyers[index]) {
			this.upstreamKeyers[index] = {
				dveSettings: {} as any,
				chromaSettings: {} as any,
				lumaSettings: {} as any,
				patternSettings: {} as any,
				flyKeyframes: [],
				flyProperties: {} as any
			} as any
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

export interface SuperSourceProperties {
	artFillSource: number
	artCutSource: number
	artOption: Enum.SuperSourceArtOption
	artPreMultiplied: boolean
	artClip: number
	artGain: number
	artInvertKey: boolean
}

export interface SuperSourceBorder {
	borderEnabled: boolean
	borderBevel: Enum.BorderBevel
	borderOuterWidth: number
	borderInnerWidth: number
	borderOuterSoftness: number
	borderInnerSoftness: number
	borderBevelSoftness: number
	borderBevelPosition: number
	borderHue: number
	borderSaturation: number
	borderLuma: number
	borderLightSourceDirection: number
	borderLightSourceAltitude: number
}

export class SuperSource {
	index: number
	boxes: { [index: string]: SuperSourceBox | undefined } = {}
	properties: SuperSourceProperties
	border: SuperSourceBorder

	constructor (index: number) {
		this.index = index

		this.properties = {
			artFillSource: 0,
			artCutSource: 0,
			artOption: Enum.SuperSourceArtOption.Background,
			artPreMultiplied: false,
			artClip: 0,
			artGain: 0,
			artInvertKey: false
		}
		this.border = {
			borderEnabled: false,
			borderBevel: Enum.BorderBevel.None,
			borderOuterWidth: 0,
			borderInnerWidth: 0,
			borderOuterSoftness: 0,
			borderInnerSoftness: 0,
			borderBevelSoftness: 0,
			borderBevelPosition: 0,
			borderHue: 0,
			borderSaturation: 0,
			borderLuma: 0,
			borderLightSourceDirection: 0,
			borderLightSourceAltitude: 0
		}
	}
}

export interface FadeToBlackProperties {
	isFullyBlack: boolean
	rate: number
	inTransition: boolean
	remainingFrames: number
}

export class AtemVideoState {
	ME: { [index: string]: MixEffect | undefined } = {}
	downstreamKeyers: { [index: string]: DownstreamKeyer | undefined } = {}
	auxilliaries: { [index: string]: number | undefined } = {}
	superSources: { [index: string]: SuperSource | undefined } = {}

	getMe (index: number): MixEffect {
		let me = this.ME[index]
		if (!me) {
			me = this.ME[index] = new MixEffect(index)
		}

		return me
	}

	getSuperSource (index: number): SuperSource {
		let ssrc = this.superSources[index]
		if (!ssrc) {
			ssrc = this.superSources[index] = new SuperSource(index)
		}

		return ssrc
	}

	getDownstreamKeyer (index: number): DownstreamKeyer {
		let dsk = this.downstreamKeyers[index]
		if (!dsk) {
			dsk = this.downstreamKeyers[index] = {} as DownstreamKeyer
		}

		return dsk
	}
}
