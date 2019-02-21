import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { Util } from '../..'
import { AudioChannel } from '../../state/audio'

export class AudioMixerInputCommand extends AbstractCommand {
	static MaskFlags = {
		MixOption: 1 << 0,
		Gain: 1 << 1,
		Balance: 1 << 2,
	}
	rawName = 'AMIP'
	mixEffect: number

	properties: Partial<AudioChannel>
	index: number

	deserialize (rawCommand: Buffer) {
		this.index = rawCommand.readUInt16BE(0)
		this.properties = {
			sourceType: rawCommand.readInt8(2),
			portType: rawCommand.readInt8(7),
			mixOption: rawCommand.readInt8(8),
			gain: Util.UIntToDecibel(rawCommand.readUInt8(10)),
			balance: rawCommand.readInt16BE(12)
		}
	}

	serialize () {
		const buffer = Buffer.alloc(12)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt16BE(this.index, 2)
		buffer.writeUInt8(this.properties.mixOption || 0, 4)
		buffer.writeUInt8(Util.DecibelToUint(this.properties.gain || 0), 8)
		buffer.writeInt16BE(this.properties.balance || 0, 8)
		return Buffer.concat([
			Buffer.from('CAMI', 'ascii'),
			buffer
		])
	}

	applyToState (state: AtemState) {
		// const channel = state.audio.getChannel(this.index)
		state.audio.channels[this.index] = {
			...state.audio.channels[this.index],
			...this.properties
		}
	}
}
