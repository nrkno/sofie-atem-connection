import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { InputChannel } from '../../state/input'
import { ExternalPorts, ExternalPortType } from '../../enums'
import { Util } from '../../lib/atemUtil'

export class InputPropertiesCommand extends AbstractCommand {
	rawName = 'InPr'
	inputId: number
	MaskFlags = {
		longName: 1 << 0,
		shortName: 1 << 1,
		isExternal: 1 << 2
	}

	properties: InputChannel

	updateProps (newProps: Partial<InputChannel>) {
		this._updateProps(newProps)
	}

	deserialize (rawCommand: Buffer) {
		this.inputId = rawCommand.readUInt16BE(0)

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

		this.properties = {
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
	}

	serialize () {
		const buffer = Buffer.alloc(32)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt16BE(this.inputId, 2)
		buffer.write(this.properties.longName || '', 4)
		buffer.write(this.properties.shortName || '', 24)
		buffer.writeUInt16BE(this.properties.externalPortType, 28)
		return Buffer.concat([Buffer.from('CInL', 'ascii'), buffer])
	}

	applyToState (state: AtemState) {
		// @TODO(Lange - 04/30/2018): We may need something to clean up inputs which
		// don't exist anymore, which can happen when switching the connection from
		// one model of ATEM to another.
		state.inputs[this.inputId] = {
			...this.properties
		}
	}
}
