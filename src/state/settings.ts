export interface MultiViewerSourceState {
	source: number
	windowIndex: number
}

export interface MultiViewerWindowState extends MultiViewerSourceState {
	safeTitle: boolean
	audioMeter: boolean
	// TODO - supports safeTitle & audioMeter?
}

export class MultiViewer {
	index: number
	windows: { [index: string]: MultiViewerWindowState } = {}

	constructor (index: number) {
		this.index = index
	}

	getWindow (index: number) {
		if (!this.windows[index]) {
			this.windows[index] = {} as MultiViewerWindowState
		}

		return this.windows[index]
	}
}

export class SettingsState {
	multiViewers: { [index: string]: MultiViewer } = {}
	videoMode: number

	constructor () {
		this.videoMode = 0
	}

	getMultiViewer (index: number) {
		if (!this.multiViewers[index]) {
			this.multiViewers[index] = new MultiViewer(index)
		}

		return this.multiViewers[index]
	}
}
