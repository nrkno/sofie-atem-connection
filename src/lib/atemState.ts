import { Model, TransitionStyle, DVEEffect } from '../enums'

export class AtemState {
	info = new DeviceInfo()
	video: AtemVideoState = new AtemVideoState()
	channels: Array<{
		name: string
		label: string
	}> = []
	tallies: Array<number> = []
	audio: AtemAudioState = new AtemAudioState()
	media: MediaState = new MediaState()
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
	downstreamKeyers: Array<{
		onAir: boolean
		inTransition: boolean
		isAuto: boolean
		remainingFrames: number
	}> = []
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
	transitionSettings = new TransitionSettings()
}

export class TransitionSettings {
	dip: {
		rate: number,
		source: number
	}
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

export class AudioChannel {
	on: boolean
	afv: boolean
	gain: number
	rawGain: number
	rawPan: number
	leftLevel: number
	rightLevel: number
}

export class MediaState {
	stillPool = {}
	clipPool = {}
	players: Array<{ playing: boolean, loop: boolean, atBeginning: boolean, clipFrame: number }> = []
}
