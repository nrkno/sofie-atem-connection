import { Model, TransitionStyle } from '../atem'

export class AtemState {
	_ver0: number
	_ver1: number
	_pin: string
	model: Model
	topology: AtemTopology = new AtemTopology()
	video: AtemVideoState = new AtemVideoState()
	channels: Array<{
		name: string
		label: string
	}> = []
	tallies: Array<number> = []
	audio: AtemAudioState = new AtemAudioState()
}

export class AtemTopology {
	numberOfMEs: number
	numberOfSources: number
	numberOfColorGenerators: number
	numberOfAUXs: number
	numberOfTalkbackOutputs: number
	numberOfMediaPlayers: number
	numberOfSerialPorts: number
	maxNumberOfHyperdecks: number
	numberOfDVEs: number
	numberOfStingers: number
	numberOfSuperSources: number
}

export class AtemVideoState {
	ME: Array<MixEffect> = []
	downstreamKeyOn: Array<boolean> = []
	downstreamTie: Array<boolean> = []
	auxilliaries: Array<number> = []
}

export class AtemAudioState {
	numberOfChannels: number
	hasMonitor: boolean
	channels: Array<AudioChannel> = []
	master: AudioChannel = new AudioChannel()
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
