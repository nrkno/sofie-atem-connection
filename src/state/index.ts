import { DeviceInfo } from './info'
import { AtemVideoState } from './video'
import { AtemAudioState } from './audio'
import { MediaState } from './media'
import { InputChannel } from './input'
import { MacroState } from './macro'
import { SettingsState } from './settings'

export class AtemState {
	public info = new DeviceInfo()
	public video: AtemVideoState = new AtemVideoState()
	public audio: AtemAudioState = new AtemAudioState()
	public media: MediaState = new MediaState()
	public inputs: Array<InputChannel> = []
	public macro: MacroState = new MacroState()
	public settings: SettingsState = new SettingsState()
}
