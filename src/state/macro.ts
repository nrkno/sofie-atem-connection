export interface MacroPlayerState {
	isRunning: boolean
	isWaiting: boolean
	loop: boolean
	macroIndex: number
}

export interface MacroRecorderState {
	isRecording: boolean
	macroIndex: number
}

export interface MacroPropertiesState {
	readonly isUsed: boolean
	readonly hasUnsupportedOps: boolean
	name: string
	description: string
}

export interface MacroState {
	macroPlayer: MacroPlayerState
	macroRecorder: MacroRecorderState
	readonly macroProperties: Array<MacroPropertiesState | undefined>
}
