import { AtemState } from '../../state'
import { Util } from '../..'
import { AudioChannel } from '../../state/audio'
import { WritableCommand, DeserializedCommand } from '../CommandBase'

export class AudioMixerInputCommand extends WritableCommand<AudioChannel> {
	static MaskFlags = {
		mixOption: 1 << 0,
		gain: 1 << 1,
		balance: 1 << 2
	}
	static readonly rawName = 'CAMI'

	readonly index: number

	constructor (index: number) {
		super()

		this.index = index
		this.properties = {}
	}

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

export class AudioMixerInputUpdateCommand extends DeserializedCommand<AudioChannel> {
	static readonly rawName = 'AMIP'

	readonly index: number

	constructor (index: number, properties: AudioChannel) {
		super(properties)

		this.index = index
	}

	static deserialize (rawCommand: Buffer): AudioMixerInputUpdateCommand {
		const index = rawCommand.readUInt16BE(0)
		const properties = {
			sourceType: rawCommand.readUInt8(2),
			portType: rawCommand.readUInt8(7),
			mixOption: rawCommand.readUInt8(8),
			gain: Util.UInt16BEToDecibel(rawCommand.readUInt16BE(10)),
			balance: Util.IntToBalance(rawCommand.readInt16BE(12))
		}

		return new AudioMixerInputUpdateCommand(index, properties)
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
