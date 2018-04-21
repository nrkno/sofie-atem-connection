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
	transitionPreview: boolean
	transitionPosition: number
	transitionFrameCount: number
	fadeToBlack: boolean
	upstreamKeyState: Array<any> = []
	upstreamKeyNextState: Array<any> = []
	numberOfKeyers: number
	transitionStyle: TransitionStyle
	upstreamKeyNextBackground: boolean
	transitionSettings = {
		dip: {
			rate: 0,
			source: 0
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
