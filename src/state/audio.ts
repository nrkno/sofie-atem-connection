export class AudioChannel {
	on: boolean
	afv: boolean
	gain: number
	rawGain: number
	rawPan: number
	leftLevel: number
	rightLevel: number
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
