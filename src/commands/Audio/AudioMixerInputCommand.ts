import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { Util } from '../..'
import { AudioChannel } from '../../state/audio'

export class AudioMixerInputCommand extends AbstractCommand {
	static MaskFlags = {
		mixOption: 1 << 0,
		gain: 1 << 1,
		balance: 1 << 2
	}
	rawName = 'CAMI'
	mixEffect: number

	properties: Partial<AudioChannel>
	index: number

	serialize () {
		const buffer = Buffer.alloc(12)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt16BE(this.index, 2)
		buffer.writeUInt8(this.properties.mixOption || 0, 4)
		buffer.writeUInt16BE(Util.DecibelToUInt16BE(this.properties.gain || 0), 6)
		buffer.writeInt16BE(Util.BalanceToInt(this.properties.balance || 0), 8)
		return buffer
	}
}

export class AudioMixerInputUpdateCommand extends AbstractCommand {
	rawName = 'AMIP'
	mixEffect: number

	properties: Partial<AudioChannel>
	index: number

	deserialize (rawCommand: Buffer) {
		this.index = rawCommand.readUInt16BE(0)
		this.properties = {
			sourceType: rawCommand.readUInt8(2),
			portType: rawCommand.readUInt8(7),
			mixOption: rawCommand.readUInt8(8),
			gain: Util.UInt16BEToDecibel(rawCommand.readUInt16BE(10)),
			balance: Util.IntToBalance(rawCommand.readInt16BE(12))
		}
	}

	applyToState (state: AtemState) {
		// const channel = state.audio.getChannel(this.index)
		state.audio.channels[this.index] = {
			...state.audio.channels[this.index],
			...this.properties
		}
		return `audio.channels.${this.index}`
	}
}
