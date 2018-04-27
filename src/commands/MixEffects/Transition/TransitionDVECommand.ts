import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { DVETransitionSettings } from '../../../state/video'

export class TransitionDVECommand extends AbstractCommand {
	rawName = 'TDvP'
	mixEffect: number
	MaskFlags = {
		rate: 1 << 0,
		logoRate: 1 << 1,
		style: 1 << 2,
		fillSource: 1 << 3,
		keySource: 1 << 4,
		enableKey: 1 << 5,
		preMultiplied: 1 << 6,
		clip: 1 << 7,
		gain: 1 << 8,
		invertKey: 1 << 9,
		reverse: 1 << 10,
		flipFlop: 1 << 11
	}

	properties: DVETransitionSettings

	updateProps (newProps: Partial<DVETransitionSettings>) {
		this._updateProps(newProps)
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
		this.properties = {
			rate: rawCommand[1],
			logoRate: rawCommand[2],
			style: rawCommand[3],
			fillSource: rawCommand[4] << 8 | (rawCommand[5] & 0xff),
			keySource: rawCommand[6] << 8 | (rawCommand[7] & 0xff),

			enableKey: rawCommand[8] === 1,
			preMultiplied: rawCommand[9] === 1,
			clip: rawCommand[10] << 8 | (rawCommand[11] & 0xff),
			gain: rawCommand[12] << 8 | (rawCommand[13] & 0xff),
			invertKey: rawCommand[14] === 1,
			reverse: rawCommand[15] === 1,
			flipFlop: rawCommand[16] === 1
		}
	}

	serialize () {
		const rawCommand = 'CTDv'
		const buffer = new Buffer(24)
		buffer.fill(0)
		Buffer.from(rawCommand).copy(buffer, 0)

		buffer.writeUInt16BE(this.flag, 4)

		buffer.writeUInt8(this.mixEffect, 6)
		buffer.writeUInt8(this.properties.rate, 7)
		buffer.writeUInt8(this.properties.logoRate, 8)
		buffer.writeUInt8(this.properties.style, 9)

		buffer.writeUInt16BE(this.properties.fillSource, 10)
		buffer.writeUInt16BE(this.properties.keySource, 12)

		buffer[14] = this.properties.enableKey ? 1 : 0
		buffer[15] = this.properties.preMultiplied ? 1 : 0
		buffer.writeUInt16BE(this.properties.clip, 16)
		buffer.writeUInt16BE(this.properties.gain, 18)
		buffer[20] = this.properties.invertKey ? 1 : 0
		buffer[21] = this.properties.reverse ? 1 : 0
		buffer[22] = this.properties.flipFlop ? 1 : 0

		return buffer
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionSettings.DVE = {
			...this.properties
		}
	}
}
