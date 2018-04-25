import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'

export class ProductIdentifierCommand implements AbstractCommand {
	resolve: () => void
	reject: () => void
	rawName = '_pin'
	packetId: number

	deviceName: string
	model: number

	deserialize (rawCommand: Buffer) {
		this.deviceName = rawCommand.toString('utf-8')
		this.model = rawCommand[40]
	}

	serialize () {
		let rawName = Buffer.from(this.deviceName)
		// https://github.com/LibAtem/LibAtem/blob/master/LibAtem/Commands/DeviceProfile/ProductIdentifierCommand.cs#L12
		return Buffer.from([...Buffer.from(rawName), 0x28, 0x36, 0x9B, 0x60, 0x4C, 0x08, 0x11, 0x60, 0x04, 0x3D, 0xA4, 0x60])
	}

	getAttributes () {
		return {
			deviceName: this.deviceName,
			model: this.model
		}
	}

	applyToState (state: AtemState) {
		state.info.productIdentifier = this.deviceName
		state.info.model = this.model
	}
}
