import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { MacroPropertiesState } from '../../state/macro'
import { Util } from '../../lib/atemUtil'

export class MacroPropertiesCommand extends AbstractCommand {
	rawName = 'MPrp'

	macroIndexID: number
	properties: MacroPropertiesState

	deserialize (rawCommand: Buffer) {
		this.macroIndexID = rawCommand.readUInt16BE(0)
		const descLen = rawCommand.readUInt16BE(4)
		const nameLen = rawCommand.readUInt16BE(6)

		this.properties = {
			description: '',
			isUsed: Boolean(rawCommand[2] & 1 << 0),
			macroIndex: this.macroIndexID,
			name: ''
		}

		if (descLen > 0) {
			this.properties.description = Util.bufToNullTerminatedString(rawCommand, (8 + nameLen), descLen)
		}

		if (nameLen > 0) {
			this.properties.name = Util.bufToNullTerminatedString(rawCommand, 8, nameLen)
		}
	}

	applyToState (state: AtemState) {
		state.macro.macroProperties[this.macroIndexID] = {
			...state.macro.macroProperties[this.macroIndexID],
			...this.properties
		}
	}
}
