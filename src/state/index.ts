import { DeviceInfo } from './info'
import { AtemVideoState } from './video'
import { AtemClassicAudioState } from './audio'
import { MediaState } from './media'
import { InputChannel } from './input'
import { MacroState } from './macro'
import { SettingsState } from './settings'
import { RecordingState } from './recording'
import { StreamingState } from './streaming'
import { AtemFairlightAudioState } from './fairlight'
import * as AtemStateUtil from './util'
export { AtemStateUtil }

export interface AtemState {
	info: DeviceInfo
	video: AtemVideoState
	audio?: AtemClassicAudioState
	fairlight?: AtemFairlightAudioState
	media: MediaState
	inputs: { [inputId: number]: InputChannel | undefined }
	macro: MacroState
	settings: SettingsState
	recording?: RecordingState
	streaming?: StreamingState
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
