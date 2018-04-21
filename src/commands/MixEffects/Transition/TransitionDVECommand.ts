import IAbstractCommand from '../../AbstractCommand'
import { AtemState, DVEEffect } from '../../../lib/atemState'
// import { Util } from '../../../lib/atemUtil'

export class TransitionDVECommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = 'TDvP'
	packetId: number

	mixEffect: number
	rate: number
	logoRate: number
	style: DVEEffect
	fillSource: number
	keySource: number

	enableKey: boolean
	preMultiplied: boolean
	clip: number
	gain: number
	invertKey: boolean
	reverse: boolean
	flipFlop: boolean
	flags: number

	MaskFlags = {
		Rate: 1 << 0,
		LogoRate: 1 << 1,
		Style: 1 << 2,
		FillSource: 1 << 3,
		KeySource: 1 << 4,
		EnableKey: 1 << 5,
		PreMultiplied: 1 << 6,
		Clip: 1 << 7,
		Gain: 1 << 8,
		InvertKey: 1 << 9,
		Reverse: 1 << 10,
		FlipFlop: 1 << 11
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
		this.rate = rawCommand[1]
		this.logoRate = rawCommand[2]
		this.style = rawCommand[3]
		this.fillSource = rawCommand[4] << 8 | (rawCommand[5] & 0xff)
		this.keySource = rawCommand[6] << 8 | (rawCommand[7] & 0xff)

		this.enableKey = rawCommand[8] === 1
		this.preMultiplied = rawCommand[9] === 1
		this.clip = rawCommand[10] << 8 | (rawCommand[11] & 0xff)
		this.gain = rawCommand[12] << 8 | (rawCommand[13] & 0xff)
		this.invertKey = rawCommand[14] === 1
		this.reverse = rawCommand[15] === 1
		this.flipFlop = rawCommand[16] === 1
	}

	serialize () {
		let rawCommand = 'CTDv'
		let buffer = new Buffer(24)
		buffer.fill(0)
		Buffer.from(rawCommand).copy(buffer, 0)

		buffer.writeUInt16BE(this.flags, 4)

		buffer.writeUInt8(this.mixEffect, 6)
		buffer.writeUInt8(this.rate, 7)
		buffer.writeUInt8(this.logoRate, 8)
		buffer.writeUInt8(this.style, 9)

		buffer.writeUInt16BE(this.fillSource, 10)
		buffer.writeUInt16BE(this.keySource, 12)

		buffer[14] = this.enableKey ? 1 : 0
		buffer[15] = this.preMultiplied ? 1 : 0
		buffer.writeUInt16BE(this.clip, 16)
		buffer.writeUInt16BE(this.gain, 18)
		buffer[20] = this.invertKey ? 1 : 0
		buffer[21] = this.reverse ? 1 : 0
		buffer[22] = this.flipFlop ? 1 : 0

		return buffer
	}

	getAttributes () {
		return {
			mixEffect: this.mixEffect,
			rate: this.rate,
			logoRate: this.logoRate,
			style: this.style, // @todo import
			fillSource: this.fillSource,
			keySource: this.keySource,

			enableKey: this.enableKey,
			preMultiplied: this.preMultiplied,
			clip: this.clip,
			gain: this.gain,
			invertKey: this.invertKey,
			reverse: this.reverse,
			flipFlop: this.flipFlop
		}
	}

	applyToState (state: AtemState) {
		let mixEffect = state.video.getMe(this.mixEffect)
		let props = this.getAttributes()
		delete props.mixEffect
		mixEffect.transitionSettings.DVE = props
	}
}
