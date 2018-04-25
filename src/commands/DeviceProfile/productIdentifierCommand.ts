import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'

export class ProductIdentifierCommand implements AbstractCommand {
	resolve: () => void
	reject: () => void
	rawName = '_pin'
	packetId: number

	properties: {
		deviceName: string
		model: number
	}

	deserialize (rawCommand: Buffer) {
		this.properties = {
			deviceName: rawCommand.toString('utf-8'),
			model: rawCommand[40]
		}
	}

	serialize () {
		let rawName = Buffer.from(this.properties.deviceName)
		// https://github.com/LibAtem/LibAtem/blob/master/LibAtem/Commands/DeviceProfile/ProductIdentifierCommand.cs#L12
		return Buffer.from([...Buffer.from(rawName), 0x28, 0x36, 0x9B, 0x60, 0x4C, 0x08, 0x11, 0x60, 0x04, 0x3D, 0xA4, 0x60])
	}

	getAttributes () {
		return {
			...this.properties
		}
	}

	applyToState (state: AtemState) {
		state.info.productIdentifier = this.properties.deviceName
		state.info.model = this.properties.model
	}
}
