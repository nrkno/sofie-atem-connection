import * as Info from './info'
import * as Video from './video'
import * as ClassicAudio from './audio'
import * as Media from './media'
import * as Input from './input'
import * as Macro from './macro'
import * as Settings from './settings'
import * as Recording from './recording'
import * as Streaming from './streaming'
import * as Fairlight from './fairlight'
import * as AtemStateUtil from './util'
import { ColorGeneratorState } from './color'

export {
	AtemStateUtil,
	Info,
	Video,
	ClassicAudio,
	Media,
	Input,
	Macro,
	Settings,
	Recording,
	Streaming,
	Fairlight,
	ColorGeneratorState
}

export interface AtemState {
	info: Info.DeviceInfo
	video: Video.AtemVideoState
	audio?: ClassicAudio.AtemClassicAudioState
	fairlight?: Fairlight.AtemFairlightAudioState
	media: Media.MediaState
	inputs: { [inputId: number]: Input.InputChannel | undefined }
	macro: Macro.MacroState
	settings: Settings.SettingsState
	recording?: Recording.RecordingState
	streaming?: Streaming.StreamingState
	colorGenerators?: { [index: number]: ColorGeneratorState | undefined }
}

export class InvalidIdError extends Error {
	constructor(message: string, ...ids: Array<number | string>) {
		super(InvalidIdError.BuildErrorString(message, ids))
		Object.setPrototypeOf(this, new.target.prototype)
	}

	private static BuildErrorString(message: string, ids: Array<number | string>): string {
		if (ids && ids.length > 0) {
			return `${message} ${ids.join('-')} is not valid`
		} else {
			return message
		}
	}
}
