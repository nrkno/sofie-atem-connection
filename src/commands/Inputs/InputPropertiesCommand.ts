import { WritableCommand, DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { InputChannel } from '../../state/input'
import { ExternalPorts, ExternalPortType } from '../../enums'
import { Util } from '../../lib/atemUtil'

export class InputPropertiesCommand extends WritableCommand<InputChannel> {
	public static MaskFlags = {
		longName: 1 << 0,
		shortName: 1 << 1,
		externalPortType: 1 << 2
	}

	public static readonly rawName = 'CInL'

	public readonly inputId: number

	constructor (inputId: number) {
		super()

		this.inputId = inputId
	}

	public serialize () {
		const buffer = Buffer.alloc(32)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt16BE(this.inputId, 2)
		buffer.write(this.properties.longName || '', 4)
		buffer.write(this.properties.shortName || '', 24)
		buffer.writeUInt16BE(this.properties.externalPortType || 0, 28)
		return buffer
	}
}

export class InputPropertiesUpdateCommand extends DeserializedCommand<InputChannel> {
	public static readonly rawName = 'InPr'

	public readonly inputId: number

	constructor (inputId: number, properties: InputChannel) {
		super(properties)

		this.inputId = inputId
	}

	public static deserialize (rawCommand: Buffer) {
		const inputId = rawCommand.readUInt16BE(0)

		const externalPortsMask = rawCommand[29]
		const externalPorts: ExternalPortType[] = []
		if (externalPortsMask & ExternalPorts.SDI) {
			externalPorts.push(ExternalPortType.SDI)
		}
		if (externalPortsMask & ExternalPorts.HDMI) {
			externalPorts.push(ExternalPortType.HDMI)
		}
		if (externalPortsMask & ExternalPorts.Component) {
			externalPorts.push(ExternalPortType.Component)
		}
		if (externalPortsMask & ExternalPorts.Composite) {
			externalPorts.push(ExternalPortType.Composite)
		}
		if (externalPortsMask & ExternalPorts.SVideo) {
			externalPorts.push(ExternalPortType.SVideo)
		}

		const properties = {
			inputId: rawCommand.readUInt16BE(0),
			longName: Util.bufToNullTerminatedString(rawCommand, 2, 20),
			shortName: Util.bufToNullTerminatedString(rawCommand, 22, 4),
			externalPorts: externalPorts.length > 0 ? externalPorts : null,
			isExternal: rawCommand[28] === 0,
			externalPortType: rawCommand.readUInt8(31),
			internalPortType: rawCommand.readUInt8(32),
			sourceAvailability: rawCommand.readUInt8(34),
			meAvailability: rawCommand.readUInt8(35)
		}

		return new InputPropertiesUpdateCommand(inputId, properties)
	}

	public applyToState (state: AtemState) {
		// @TODO(Lange - 04/30/2018): We may need something to clean up inputs which
		// don't exist anymore, which can happen when switching the connection from
		// one model of ATEM to another.
		state.inputs[this.inputId] = {
			...this.properties
		}
		return `inputs.${this.inputId}`
	}
}
