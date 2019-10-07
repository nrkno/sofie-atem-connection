import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { MacroPlayerState } from '../../state/macro'

export class MacroRunStatusCommand extends AbstractCommand {
	static readonly rawName = 'MRPr'

	readonly properties: Readonly<MacroPlayerState>

	constructor (properties: MacroPlayerState) {
		super()

		this.properties = properties
	}

	static deserialize (rawCommand: Buffer) {
		const properties = {
			isRunning: Boolean(rawCommand[0] & 1 << 0),
			isWaiting: Boolean(rawCommand[0] & 1 << 1),
			loop: Boolean(rawCommand[1] & 1 << 0),
			macroIndex: rawCommand.readUInt16BE(2)
		}

		return new MacroRunStatusCommand(properties)
	}

	applyToState (state: AtemState) {
		state.macro.macroPlayer = {
			...state.macro.macroPlayer,
			...this.properties
		}
		return `macro.macroPlayer`
	}
}
