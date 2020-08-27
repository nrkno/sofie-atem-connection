import { AtemStateUtil, AtemState } from '../state'

export function createEmptyState(): AtemState {
	const state = AtemStateUtil.Create()

	// These should be the maximum supported by any device.
	// But they can also be whatever is needed to allow the tests to run without error
	state.info.capabilities = {
		mixEffects: 4,
		sources: 40,
		auxilliaries: 6,
		mixMinusOutputs: 8,
		mediaPlayers: 4,
		serialPorts: 1,
		maxHyperdecks: 4,
		DVEs: 1,
		stingers: 1,
		superSources: 2,
		talkbackChannels: 2,
		downstreamKeyers: 4,
		cameraControl: true,
		advancedChromaKeyers: true,
		onlyConfigurableOutputs: true
	}
	state.info.mixEffects = [
		{
			keyCount: 4
		},
		{
			keyCount: 4
		},
		{
			keyCount: 4
		},
		{
			keyCount: 4
		}
	]
	state.info.multiviewer = {
		count: 255,
		windowCount: 16
	}
	state.streaming = {
		service: {
			serviceName: '',
			url: '',
			key: '',
			bitrates: [0, 0]
		}
	}
	state.recording = {
		properties: {
			filename: '',
			workingSet1DiskId: 0,
			workingSet2DiskId: 0,
			recordInAllCameras: false
		},
		disks: {}
	}
	state.audio = {
		channels: {}
	}
	state.fairlight = {
		inputs: {}
	}

	return state
}
