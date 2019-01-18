export interface MultiViewerSourceState {
	source: number
	windowIndex: number
}

export class SettingsState {
	multiViewerSource: Array<MultiViewerSourceState> = []
	videoMode: number
}