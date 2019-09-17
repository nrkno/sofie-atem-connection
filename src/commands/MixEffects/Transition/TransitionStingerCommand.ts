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

	rawName = 'CTSt'
	mixEffect: number

	properties: StingerTransitionSettings

	updateProps (newProps: Partial<StingerTransitionSettings>) {
		this._updateProps(newProps)
	}

	serialize () {
		const buffer = Buffer.alloc(20)
		buffer.writeUInt16BE(this.flag, 0)

		buffer.writeUInt8(this.mixEffect, 2)
		buffer.writeUInt8(this.properties.source, 3)
		buffer.writeUInt8(this.properties.preMultipliedKey ? 1 : 0, 4)

		buffer.writeUInt16BE(this.properties.clip, 6)
		buffer.writeUInt16BE(this.properties.gain, 8)
		buffer.writeUInt8(this.properties.invert ? 1 : 0, 10)

		buffer.writeUInt16BE(this.properties.preroll, 12)
		buffer.writeUInt16BE(this.properties.clipDuration, 14)
		buffer.writeUInt16BE(this.properties.triggerPoint, 16)
		buffer.writeUInt16BE(this.properties.mixRate, 18)

		return buffer
	}
}

export class TransitionStingerUpdateCommand extends AbstractCommand {
	rawName = 'TStP'
	mixEffect: number

	properties: StingerTransitionSettings

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

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionSettings.stinger = {
			...this.properties
		}
		return `video.ME.${this.mixEffect}.transitionSettings.stinger`
	}
}
