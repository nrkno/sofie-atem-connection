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
	description: string
	isUsed: boolean
	macroIndex: number
	name: string
}

export class MacroState {
	macroPlayer: MacroPlayerState
	macroRecorder: MacroRecorderState
	macroProperties: Array<MacroPropertiesState> = []
}
