import { Model, TransitionStyle } from '../atem'

export class AtemState {
	info = new DeviceInfo()
	video: AtemVideoState = new AtemVideoState()
	channels: Array<{
		name: string
		label: string
	}> = []
	tallies: Array<number> = []
	audio: AtemAudioState = new AtemAudioState()
}

export class DeviceInfo {
	apiVersion = new ApiInfo()
	capabilities = new AtemCapabilites()
	model: Model
	productIdentifier: string
}

export class ApiInfo {
	major: number
	minor: number
}

export class AtemCapabilites {
	MEs: number
	sources: number
	colorGenerators: number
	auxilliaries: number
	talkbackOutputs: number
	mediaPlayers: number
	serialPorts: number
	maxHyperdecks: number
	DVEs: number
	stingers: number
	superSources: number
}

export class AtemVideoState {
	ME: Array<MixEffect> = []
	downstreamKeyOn: Array<boolean> = []
	downstreamTie: Array<boolean> = []
	auxilliaries: Array<number> = []

	getMe (index: number) {
		if (!this.ME[index]) {
			this.ME[index] = new MixEffect()
		}
		return this.ME[index]
	}
}

export class AtemAudioState {
	numberOfChannels: number
	hasMonitor: boolean
	channels: Array<AudioChannel> = []
	master: AudioChannel = new AudioChannel()

	getMe (index: number) {
		if (!this.channels[index]) {
			this.channels[index] = new AudioChannel()
		}
		return this.channels[index]
	}
}

export class MixEffect {
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
	transitionSettings: {
		dip: {
			rate: number,
			source: number
		},
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
			flipFlop: boolean},
		mix: {
			rate: number
		}
	}
}

export class AudioChannel {
	on: boolean
	afv: boolean
	gain: number
	rawGain: number
	rawPan: number
	leftLevel: number
	rightLevel: number
}

export enum DVEEffect {
	SwooshTopLeft= 0,
	SwooshTop = 1,
	SwooshTopRight = 2,
	SwooshLeft = 3,
	SwooshRight = 4,
	SwooshBottomLeft = 5,
	SwooshBottom = 6,
	SwooshBottomRight = 7,

	SpinCCWTopRight = 13,
	SpinCWTopLeft = 8,
	SpinCCWBottomRight = 15,
	SpinCWBottomLeft = 10,
	SpinCWTopRight = 9,
	SpinCCWTopLeft = 12,
	SpinCWBottomRight = 11,
	SpinCCWBottomLeft = 14,

	SqueezeTopLeft = 16,
	SqueezeTop = 17,
	SqueezeTopRight = 18,
	SqueezeLeft = 19,
	SqueezeRight = 20,
	SqueezeBottomLeft = 21,
	SqueezeBottom = 22,
	SqueezeBottomRight = 23,

	PushTopLeft = 24,
	PushTop = 25,
	PushTopRight = 26,
	PushLeft = 27,
	PushRight = 28,
	PushBottomLeft = 29,
	PushBottom = 30,
	PushBottomRight = 31,

	GraphicCWSpin = 32,
	GraphicCCWSpin = 33,
	GraphicLogoWipe = 34
}
