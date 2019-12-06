import { plainToClass } from 'class-transformer'
import { AtemState } from '..'
import { AtemAudioState } from '../state/audio'
import { AtemVideoState, MixEffect, SuperSource } from '../state/video'

function parseAudio (rawState: AtemAudioState) {
	const state = plainToClass(AtemAudioState, rawState)
	state.master = state.master
	state.channels = state.channels.map(ch => ch)

	return state
}

function parseVideo (rawState: AtemVideoState) {
	return plainToClass(AtemVideoState, {
		...rawState,
		ME: rawState.ME.map(me => plainToClass(MixEffect, me)),
		superSources: rawState.superSources.map(ssrc => plainToClass(SuperSource, ssrc))
	})
}

/** Note: This is incomplete, and should be filled in as needed */
export function parseAtemState (rawState: any): AtemState {
	const state = plainToClass(AtemState, rawState)
	state.audio = parseAudio(state.audio)
	state.video = parseVideo(state.video)

	return state
}

export function createEmptyState () {
	const state = new AtemState()

	// These should be the maximum supported by any device.
	// But they can also be whatever is needed to allow the tests to run without error
	state.info.capabilities = {
		mixEffects: 4,
		sources: 40,
		colorGenerators: 2,
		auxilliaries: 6,
		talkbackOutputs: 8,
		mediaPlayers: 4,
		serialPorts: 1,
		maxHyperdecks: 4,
		DVEs: 1,
		stingers: 1,
		superSources: 2,
		talkbackOverSDI: 0,
		multiViewers: 255,
		downstreamKeyers: 4,
		upstreamKeyers: 4
	}

	return state
}
