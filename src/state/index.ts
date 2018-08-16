import { DeviceInfo } from './info'
import { AtemVideoState } from './video'
import { AtemAudioState } from './audio'
import { MediaState } from './media'
import { InputChannel } from './input'
import { MacroState } from './macro'

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
	inputs: Array<InputChannel> = []
	macros: Array<MacroState> = []

	getMacro (index: number) {
		if (!this.macros[index]) {
			this.macros[index] = {} as MacroState
		}

		return this.macros[index]
	}
}
