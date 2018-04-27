import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { WipeTransitionSettings } from '../../../state/video'

export class TransitionWipeCommand extends AbstractCommand {
	rawName = 'TWpP'
	mixEffect: number
	MaskFlags = {
		rate: 1 << 0,
		pattern: 1 << 1,
		borderWidth: 1 << 2,
		borderInput: 1 << 3,
		symmetry: 1 << 4,
		borderSoftness: 1 << 5,
		xPosition: 1 << 6,
		yPosition: 1 << 7,
		reverseDirection: 1 << 8,
		flipFlop: 1 << 9
	}

	properties: WipeTransitionSettings

	updateProps (newProps: Partial<WipeTransitionSettings>) {
		this._updateProps(newProps)
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
		this.properties = {
			rate: rawCommand[1],
			pattern: rawCommand[2],
			borderWidth: rawCommand[4] << 8 | rawCommand[5],
			borderInput: rawCommand[6] << 8 | rawCommand[7],
			symmetry: rawCommand[8] << 8 | rawCommand[9],
			borderSoftness: rawCommand[10] << 8 | rawCommand[11],
			xPosition: rawCommand[12] << 8 | rawCommand[13],
			yPosition: rawCommand[14] << 8 | rawCommand[15],
			reverseDirection: rawCommand[16] === 1,
			flipFlop: rawCommand[17] === 1
		}
	}

	serialize () {
		const rawCommand = 'CTWp'
		const buffer = new Buffer(24)
		buffer.fill(0)
		Buffer.from(rawCommand).copy(buffer, 0)

		buffer.writeUInt16BE(this.flag, 4)

		buffer.writeUInt8(this.mixEffect, 6)
		buffer.writeUInt8(this.properties.rate, 7)
		buffer.writeUInt8(this.properties.pattern, 8)

		buffer.writeUInt16BE(this.properties.borderWidth, 10)
		buffer.writeUInt16BE(this.properties.borderInput, 12)
		buffer.writeUInt16BE(this.properties.symmetry ? 1 : 0, 14)

		buffer.writeUInt16BE(this.properties.borderSoftness, 16)
		buffer.writeUInt16BE(this.properties.xPosition, 18)
		buffer.writeUInt16BE(this.properties.yPosition, 20)
		buffer.writeUInt8(this.properties.reverseDirection ? 1 : 0, 22)
		buffer.writeUInt8(this.properties.flipFlop ? 1 : 0, 23)

		return buffer
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionSettings.wipe = {
			...this.properties
		}
	}
}
