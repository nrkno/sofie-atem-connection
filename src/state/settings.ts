export interface MultiViewerSourceState {
	source: number
	windowIndex: number
}

export interface MultiViewerWindowState extends MultiViewerSourceState {
	safeTitle?: boolean
	audioMeter?: boolean
	// TODO - supports safeTitle & audioMeter?
}

export class MultiViewer {
	public readonly index: number
	public readonly windows: { [index: string]: MultiViewerWindowState | undefined } = {}

	constructor (index: number) {
		this.index = index
	}
}

export class SettingsState {
	public readonly multiViewers: { [index: string]: MultiViewer | undefined } = {}
	public videoMode: number

	constructor () {
		this.videoMode = 0
	}

	public getMultiViewer (index: number): MultiViewer {
		const multiViewer = this.multiViewers[index]
		if (!multiViewer) {
			return this.multiViewers[index] = new MultiViewer(index)
		}

		return multiViewer
	}
}
