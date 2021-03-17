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
import * as Camera from './camera'
import * as AtemStateUtil from './util'
export { AtemStateUtil, Info, Video, ClassicAudio, Media, Input, Macro, Settings, Recording, Streaming, Fairlight, Camera }

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
	cameras: { [cameraId: number]: Camera.Camera | undefined }
}

export class InvalidIdError extends Error {
	constructor(message: string, ...ids: number[]) {
		super(InvalidIdError.BuildErrorString(message, ids))
		Object.setPrototypeOf(this, new.target.prototype)
	}

	private static BuildErrorString(message: string, ids: number[]): string {
		if (ids && ids.length > 0) {
			return `${message} ${ids.join('-')} is not valid`
		} else {
			return message
		}
	}
}
