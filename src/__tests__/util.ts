import { plainToClass } from 'class-transformer'
import { AtemState } from '..'
import { AtemAudioState, AudioChannel, AudioMasterChannel } from '../state/audio'
import { AtemVideoState, MixEffect, SuperSource } from '../state/video'

function parseAudio (rawState: AtemAudioState) {
	const state = plainToClass(AtemAudioState, rawState)
	state.master = plainToClass(AudioMasterChannel, state.master)
	state.channels = state.channels.map(ch => plainToClass(AudioChannel, ch))

	return state
}

function parseVideo (rawState: AtemVideoState) {
	const state = plainToClass(AtemVideoState, rawState)
	Object.keys(state.ME).map(id => {
		state.ME[id] = plainToClass(MixEffect, state.ME[id])
	})
	Object.keys(state.superSources).map(id => {
		state.superSources[id] = plainToClass(SuperSource, state.superSources[id])
	})

	return state
}

/** Note: This is incomplete, and should be filled in as needed */
export function parseAtemState (rawState: any): AtemState {
	const state = plainToClass(AtemState, rawState)
	state.audio = parseAudio(state.audio)
	state.video = parseVideo(state.video)

	return state
}
