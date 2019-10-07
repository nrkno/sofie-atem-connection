import AbstractCommand, { WritableCommand } from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { WipeTransitionSettings } from '../../../state/video'
import { Util, Enums } from '../../..'

export class TransitionWipeCommand extends WritableCommand<WipeTransitionSettings> {
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

	static readonly rawName = 'CTWp'

	readonly mixEffect: number

	constructor (mixEffect: number) {
		super()

		this.mixEffect = mixEffect
	}

	serialize () {
		const buffer = Buffer.alloc(20)
		buffer.writeUInt16BE(this.flag, 0)

		buffer.writeUInt8(this.mixEffect, 2)
		buffer.writeUInt8(this.properties.rate || 0, 3)
		buffer.writeUInt8(this.properties.pattern || 0, 4)

		buffer.writeUInt16BE(this.properties.borderWidth || 0, 6)
		buffer.writeUInt16BE(this.properties.borderInput || 0, 8)
		buffer.writeUInt16BE(this.properties.symmetry || 0, 10)

		buffer.writeUInt16BE(this.properties.borderSoftness || 0, 12)
		buffer.writeUInt16BE(this.properties.xPosition || 0, 14)
		buffer.writeUInt16BE(this.properties.yPosition || 0, 16)
		buffer.writeUInt8(this.properties.reverseDirection ? 1 : 0, 18)
		buffer.writeUInt8(this.properties.flipFlop ? 1 : 0, 19)

		return buffer
	}
}

export class TransitionWipeUpdateCommand extends AbstractCommand {
	static readonly rawName = 'TWpP'

	readonly mixEffect: number
	readonly properties: Readonly<WipeTransitionSettings>

	constructor (mixEffect: number, properties: WipeTransitionSettings) {
		super()

		this.mixEffect = mixEffect
		this.properties = properties
	}

	static deserialize (rawCommand: Buffer): TransitionWipeUpdateCommand {
		const mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		const properties = {
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

		return new TransitionWipeUpdateCommand(mixEffect, properties)
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionSettings.wipe = {
			...this.properties
		}
		return `video.ME.${this.mixEffect}.transitionSettings.wipe`
	}
}
