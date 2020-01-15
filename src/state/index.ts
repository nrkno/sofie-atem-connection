import { DeviceInfo } from './info'
import { AtemVideoState } from './video'
import { AtemAudioState } from './audio'
import { MediaState } from './media'
import { InputChannel } from './input'
import { MacroState } from './macro'
import { SettingsState } from './settings'

export { AtemStateUtil } from './util'

export interface AtemState {
	info: DeviceInfo
	video: AtemVideoState
	audio: AtemAudioState
	media: MediaState
	inputs: { [inputId: number]: InputChannel | undefined }
	macro: MacroState
	settings: SettingsState
}
