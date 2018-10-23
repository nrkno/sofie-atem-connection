import { DeviceInfo } from './info'
import { AtemVideoState } from './video'
import { AtemAudioState } from './audio'
import { MediaState } from './media'
import { InputChannel } from './input'
import { MacroPlayerState } from './macroPlayer'

export class AtemState {
	info = new DeviceInfo()
	settings = {
		videoMode: 0
	}
	video: AtemVideoState = new AtemVideoState()
	channels: Array<{
		name: string
		label: string
	}> = []
	tallies: Array<number> = []
	audio: AtemAudioState = new AtemAudioState()
	media: MediaState = new MediaState()
	inputs: Array<InputChannel> = []
	macroPlayer: MacroPlayerState
}
