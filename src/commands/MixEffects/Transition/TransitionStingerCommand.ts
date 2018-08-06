import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { StingerTransitionSettings } from '../../../state/video'
import { Util } from '../../..'

export class TransitionStingerCommand extends AbstractCommand {
	static MaskFlags = {
		source: 1 << 0,
		preMultipliedKey: 1 << 1,
		clip: 1 << 2,
		gain: 1 << 3,
		invert: 1 << 4,
		preroll: 1 << 5,
		clipDuration: 1 << 6,
		triggerPoint: 1 << 7,
		mixRate: 1 << 8
	}

	rawName = 'TStP'
	mixEffect: number

	properties: StingerTransitionSettings

	updateProps (newProps: Partial<StingerTransitionSettings>) {
		this._updateProps(newProps)
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		this.properties = {
			source: rawCommand[1],
			preMultipliedKey: rawCommand[2] === 1,

			clip: Util.parseNumberBetween(rawCommand.readUInt16BE(4), 0, 1000),
			gain: Util.parseNumberBetween(rawCommand.readUInt16BE(6), 0, 1000),
			invert: rawCommand[8] === 1,

			preroll: rawCommand[10] << 8 | rawCommand[11],
			clipDuration: rawCommand[12] << 8 | rawCommand[13],
			triggerPoint: rawCommand[14] << 8 | rawCommand[15],
			mixRate: rawCommand[16] << 8 | rawCommand[17]
		}
	}

	serialize () {
		const rawCommand = 'CTSt'
		const buffer = new Buffer(24)
		buffer.fill(0)
		Buffer.from(rawCommand).copy(buffer, 0)

		buffer.writeUInt16BE(this.flag, 4)

		buffer.writeUInt8(this.mixEffect, 6)
		buffer.writeUInt8(this.properties.source, 7)
		buffer.writeUInt8(this.properties.preMultipliedKey ? 1 : 0, 8)

		buffer.writeUInt16BE(this.properties.clip, 10)
		buffer.writeUInt16BE(this.properties.gain, 12)
		buffer.writeUInt8(this.properties.invert ? 1 : 0, 14)

		buffer.writeUInt16BE(this.properties.preroll, 16)
		buffer.writeUInt16BE(this.properties.clipDuration, 18)
		buffer.writeUInt16BE(this.properties.triggerPoint, 20)
		buffer.writeUInt16BE(this.properties.mixRate, 22)

		return buffer
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionSettings.stinger = {
			...this.properties
		}
	}
}
