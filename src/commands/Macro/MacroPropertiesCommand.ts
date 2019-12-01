import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { MacroPropertiesState } from '../../state/macro'
import { Util } from '../../lib/atemUtil'

export class MacroPropertiesCommand extends DeserializedCommand<MacroPropertiesState> {
	public static readonly rawName = 'MPrp'

	public readonly macroIndexID: number

	constructor (macroIndexID: number, properties: MacroPropertiesState) {
		super(properties)

		this.macroIndexID = macroIndexID
	}

	public static deserialize (rawCommand: Buffer): MacroPropertiesCommand {
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

	public applyToState (state: AtemState) {
		state.macro.macroProperties[this.macroIndexID] = {
			...state.macro.macroProperties[this.macroIndexID],
			...this.properties
		}
		return `macro.macroProperties.${this.macroIndexID}`
	}
}
