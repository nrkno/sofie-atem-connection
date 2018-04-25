import { DeviceInfo } from './info'
import { AtemVideoState } from './video'
import { AtemAudioState } from './audio'
import { MediaState } from './media'

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
