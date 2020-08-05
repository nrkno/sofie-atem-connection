import { DeserializedCommand, WritableCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { MacroPropertiesState } from '../../state/macro'
import * as Util from '../../lib/atemUtil'

export class MacroPropertiesUpdateCommand extends DeserializedCommand<MacroPropertiesState> {
	public static readonly rawName = 'MPrp'

	public readonly macroIndex: number

	constructor(macroIndexID: number, properties: MacroPropertiesState) {
		super(properties)

		this.macroIndex = macroIndexID
	}

	public static deserialize(rawCommand: Buffer): MacroPropertiesUpdateCommand {
		const macroIndexID = rawCommand.readUInt16BE(0)
		const nameLen = rawCommand.readUInt16BE(4)
		const descLen = rawCommand.readUInt16BE(6)

		const properties: MacroPropertiesState = {
			isUsed: rawCommand.readUInt8(2) != 0,
			hasUnsupportedOps: rawCommand.readUInt8(3) != 0,
			name: '',
			description: ''
		}

		if (nameLen > 0) {
			properties.name = Util.bufToNullTerminatedString(rawCommand, 8, nameLen)
		}
		if (descLen > 0) {
			properties.description = Util.bufToNullTerminatedString(rawCommand, 8 + nameLen, descLen)
		}

		return new MacroPropertiesUpdateCommand(macroIndexID, properties)
	}

	public applyToState(state: AtemState): string {
		state.macro.macroProperties[this.macroIndex] = this.properties
		return `macro.macroProperties.${this.macroIndex}`
	}
}

export class MacroPropertiesCommand extends WritableCommand<Pick<MacroPropertiesState, 'name' | 'description'>> {
	public static MaskFlags = {
		name: 1 << 0,
		description: 1 << 1
	}

	public static readonly rawName = 'CMPr'

	public readonly macroIndex: number

	constructor(macroIndex: number) {
		super()

		this.macroIndex = macroIndex
	}

	public serialize(): Buffer {
		const name = this.properties.name || ''
		const description = this.properties.description || ''

		const buffer = Buffer.alloc(Util.padToMultiple4(8 + name.length + description.length))
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt16BE(this.macroIndex, 2)
		buffer.writeUInt16BE(name.length, 4)
		buffer.writeUInt16BE(description.length, 6)
		buffer.write(name, 8, 'ascii')
		buffer.write(name, 8 + name.length, 'ascii')

		return buffer
	}
}
