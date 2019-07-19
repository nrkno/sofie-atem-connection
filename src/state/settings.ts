export interface MultiViewerSourceState {
	source: number
	windowIndex: number
}

export class Settings7XState {
	multiViewers: { [viewerIndex: string]: MultiViewerSourceState } = {}
	videoMode: number
}
export interface MultiViewerWindowState extends MultiViewerSourceState {
	safeTitle: boolean
	audioMeter: boolean
}

export class MultiViewer {
	index: number
	layout: number
	overlayOpacity: number
	windows: { [index: string]: MultiViewerWindowState }

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

	getMultiViewer (index: number) {
		if (!this.multiViewers[index]) {
			this.multiViewers[index] = new MultiViewer(index)
		}

		return this.multiViewers[index]
	}
}
