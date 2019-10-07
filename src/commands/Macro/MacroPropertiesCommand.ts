import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { MacroPropertiesState } from '../../state/macro'
import { Util } from '../../lib/atemUtil'

export class MacroPropertiesCommand extends AbstractCommand {
	static readonly rawName = 'MPrp'

	readonly macroIndexID: number
	readonly properties: MacroPropertiesState

	constructor (macroIndexID: number, properties: MacroPropertiesState) {
		super()

		this.macroIndexID = macroIndexID
		this.properties = properties
	}

	static deserialize (rawCommand: Buffer): MacroPropertiesCommand {
		const macroIndexID = rawCommand.readUInt16BE(0)
		const nameLen = rawCommand.readUInt16BE(4)
		const descLen = rawCommand.readUInt16BE(6)

		const properties = {
			description: '',
			isUsed: Boolean(rawCommand[2] & 1 << 0),
			macroIndex: macroIndexID,
			name: ''
		}

		if (descLen > 0) {
			properties.description = Util.bufToNullTerminatedString(rawCommand, (8 + nameLen), descLen)
		}

		if (nameLen > 0) {
			properties.name = Util.bufToNullTerminatedString(rawCommand, 8, nameLen)
		}

		return new MacroPropertiesCommand(macroIndexID, properties)
	}

	applyToState (state: AtemState) {
		state.macro.macroProperties[this.macroIndexID] = {
			...state.macro.macroProperties[this.macroIndexID],
			...this.properties
		}
		return `macro.macroProperties.${this.macroIndexID}`
	}
}
