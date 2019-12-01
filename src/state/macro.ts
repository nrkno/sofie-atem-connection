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
	public readonly macroPlayer: MacroPlayerState
	public readonly macroRecorder: MacroRecorderState
	public readonly macroProperties: Array<MacroPropertiesState> = []

	constructor () {
		this.macroPlayer = {
			isRunning: false,
			isWaiting: false,
			loop: false,
			macroIndex: 0
		}
		this.macroRecorder = {
			isRecording: false,
			macroIndex: 0
		}
	}
}
