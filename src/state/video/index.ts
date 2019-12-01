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
	dip?: DipTransitionSettings
	DVE?: DVETransitionSettings
	mix?: MixTransitionSettings
	stinger?: StingerTransitionSettings
	wipe?: WipeTransitionSettings
}

export interface IMixEffect {
	programInput: number
	previewInput: number
	inTransition: boolean
	transitionPreview: boolean
	transitionPosition: number
	transitionFramesLeft: number
	fadeToBlack?: FadeToBlackProperties
	numberOfKeyers: number
	transitionProperties: TransitionProperties
	transitionSettings: TransitionSettings
	upstreamKeyers: Array<USK.UpstreamKeyer | undefined>
}

export class MixEffect implements IMixEffect {
	public readonly index: number
	public programInput: number = 0
	public previewInput: number = 0
	public inTransition: boolean = false
	public transitionPreview: boolean = false
	public transitionPosition: number = 0
	public transitionFramesLeft: number = 0
	public fadeToBlack?: FadeToBlackProperties
	public numberOfKeyers: number = 0
	public transitionProperties: TransitionProperties
	public transitionSettings: TransitionSettings = {}
	public readonly upstreamKeyers: Array<USK.UpstreamKeyer | undefined> = []

	constructor (index: number) {
		this.index = index

		this.transitionProperties = {
			style: Enum.TransitionStyle.MIX,
			selection: 0,
			nextStyle: Enum.TransitionStyle.MIX,
			nextSelection: 0
		}
	}

	public getUpstreamKeyer (index: number, dontCreate?: boolean): USK.UpstreamKeyer {
		let usk = this.upstreamKeyers[index]
		if (!usk) {
			usk = {
				upstreamKeyerId: index,
				mixEffectKeyType: 0,
				cutSource: 0,
				fillSource: 0,
				onAir: false,
				flyEnabled: false,
				flyKeyframes: []
			}

			if (!dontCreate) {
				this.upstreamKeyers[index] = usk
			}
		}

		return usk
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
	public readonly index: number
	public readonly boxes: [SuperSourceBox | undefined, SuperSourceBox | undefined, SuperSourceBox | undefined, SuperSourceBox | undefined]
	public properties?: SuperSourceProperties
	public border?: SuperSourceBorder

	constructor (index: number) {
		this.index = index

		this.boxes = [
			undefined, undefined, undefined, undefined
		]
	}
}

export interface FadeToBlackProperties {
	isFullyBlack: boolean
	rate: number
	inTransition: boolean
	remainingFrames: number
}

export class AtemVideoState {
	public readonly ME: Array<MixEffect | undefined> = []
	public readonly downstreamKeyers: Array<DownstreamKeyer | undefined> = []
	public readonly auxilliaries: Array<number | undefined> = []
	public readonly superSources: Array<SuperSource | undefined> = []

	public getMe (index: number, dontCreate?: boolean): MixEffect {
		let me = this.ME[index]
		if (!me) {
			me = new MixEffect(index)

			if (!dontCreate) {
				this.ME[index] = me
			}
		}

		return me
	}

	public getSuperSource (index: number, dontCreate?: boolean): SuperSource {
		let ssrc = this.superSources[index]
		if (!ssrc) {
			ssrc = new SuperSource(index)

			if (!dontCreate) {
				this.superSources[index] = ssrc
			}
		}

		return ssrc
	}

	public getDownstreamKeyer (index: number, dontCreate?: boolean): DownstreamKeyer {
		let dsk = this.downstreamKeyers[index]
		if (!dsk) {
			dsk = {
				isAuto: false,
				remainingFrames: 0,
				onAir: false,
				inTransition: false
			}

			if (!dontCreate) {
				this.downstreamKeyers[index] = dsk
			}
		}

		return dsk
	}
}
