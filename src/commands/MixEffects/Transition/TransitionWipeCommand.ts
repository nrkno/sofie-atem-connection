import IAbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../lib/atemState'

export class TransitionWipeCommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = 'TWpP'
	packetId: number

	mixEffect: number
	flags: number
	rate: number
	pattern: number
	borderWidth: number
	borderInput: number
	symmetry: number
	borderSoftness: number
	xPosition: number
	yPosition: number
	reverseDirection: boolean
	flipFlop: boolean

	maskFlags = {
		Rate: 1 << 0,
		Pattern: 1 << 1,
		BorderWidth: 1 << 2,
		BorderInput: 1 << 3,
		Symmetry: 1 << 4,
		BorderSoftness: 1 << 5,
		XPosition: 1 << 6,
		YPosition: 1 << 7,
		ReverseDirection: 1 << 8,
		FlipFlop: 1 << 9
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
		this.rate = rawCommand[1]
		this.pattern = rawCommand[2]
		this.borderWidth = rawCommand[4] << 8 | rawCommand[5]
		this.borderInput = rawCommand[6] << 8 | rawCommand[7]
		this.symmetry = rawCommand[8] << 8 | rawCommand[9]
		this.borderSoftness = rawCommand[10] << 8 | rawCommand[11]
		this.xPosition = rawCommand[12] << 8 | rawCommand[13]
		this.yPosition = rawCommand[14] << 8 | rawCommand[15]
		this.reverseDirection = rawCommand[16] === 1
		this.flipFlop = rawCommand[17] === 1
	}

	serialize () {
		let rawCommand = 'CTWp'
		let buffer = new Buffer(24)
		buffer.fill(0)
		Buffer.from(rawCommand).copy(buffer, 0)

		buffer.writeUInt16BE(this.flags, 4)

		buffer.writeUInt8(this.mixEffect, 6)
		buffer.writeUInt8(this.rate, 7)
		buffer.writeUInt8(this.pattern, 8)

		buffer.writeUInt16BE(this.borderWidth, 10)
		buffer.writeUInt16BE(this.borderInput, 12)
		buffer.writeUInt16BE(this.symmetry ? 1 : 0, 14)

		buffer.writeUInt16BE(this.borderSoftness, 16)
		buffer.writeUInt16BE(this.xPosition, 18)
		buffer.writeUInt16BE(this.yPosition, 20)
		buffer.writeUInt8(this.reverseDirection ? 1 : 0, 22)
		buffer.writeUInt8(this.flipFlop ? 1 : 0, 23)

		return buffer
	}

	getAttributes () {
		return {
			mixEffect: this.mixEffect,
			rate: this.rate,
			pattern: this.pattern,
			borderWidth: this.borderWidth,
			borderInput: this.borderInput,
			symmetry: this.symmetry,
			borderSoftness: this.borderSoftness,
			xPosition: this.xPosition,
			yPosition: this.yPosition,
			reverseDirection: this.reverseDirection,
			flipFlop: this.flipFlop
		}
	}

	applyToState (state: AtemState) {
		let mixEffect = state.video.getMe(this.mixEffect)
		let props = this.getAttributes()
		delete props.mixEffect
		mixEffect.transitionSettings.wipe = props
	}
}
