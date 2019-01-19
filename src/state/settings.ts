export interface MultiViewerSourceState {
	source: number
	windowIndex: number
}

export class MultViewerWindowState {
	[windowIndex: string]: MultiViewerSourceState
}

export class SettingsState {
	multiViewers: { [viewerIndex: string]: MultiViewerSourceState } = {}
	videoMode: number
}
