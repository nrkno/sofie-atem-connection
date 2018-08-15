import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { WipeTransitionSettings } from '../../../state/video'
import { Util, Enums } from '../../..'

export class TransitionWipeCommand extends AbstractCommand {
	static MaskFlags = {
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

	rawName = 'TWpP'
	mixEffect: number

	properties: WipeTransitionSettings

	updateProps (newProps: Partial<WipeTransitionSettings>) {
		this._updateProps(newProps)
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		this.properties = {
			rate: Util.parseNumberBetween(rawCommand[1], 1, 250),
			pattern: Util.parseEnum<Enums.Pattern>(rawCommand[2], Enums.Pattern),
			borderWidth: Util.parseNumberBetween(rawCommand.readUInt16BE(4), 0, 10000),
			borderInput: rawCommand.readUInt16BE(6),
			symmetry: Util.parseNumberBetween(rawCommand.readUInt16BE(8), 0, 10000),
			borderSoftness: Util.parseNumberBetween(rawCommand.readUInt16BE(10), 0, 10000),
			xPosition: Util.parseNumberBetween(rawCommand.readUInt16BE(12), 0, 10000),
			yPosition: Util.parseNumberBetween(rawCommand.readUInt16BE(14), 0, 10000),
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
		buffer.writeUInt16BE(this.properties.symmetry, 14)

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
