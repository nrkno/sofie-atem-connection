import { VideoMode, MultiViewerLayout } from '../enums'

export interface MultiViewerSourceState {
	source: number
	windowIndex: number
	readonly supportsVuMeter: boolean
	readonly supportsSafeArea: boolean
}

export interface MultiViewerWindowState extends MultiViewerSourceState {
	safeTitle?: boolean
	audioMeter?: boolean
	// TODO - supports safeTitle & audioMeter?
}

export interface MultiViewerPropertiesState {
	layout: MultiViewerLayout
	programPreviewSwapped: boolean
}

export interface MultiViewer {
	readonly index: number
	readonly windows: Array<MultiViewerWindowState | undefined>
	properties?: MultiViewerPropertiesState
}

export interface SettingsState {
	readonly multiViewers: Array<MultiViewer | undefined>
	videoMode: VideoMode
}
