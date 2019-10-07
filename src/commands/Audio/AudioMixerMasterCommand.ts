import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { Util } from '../..'
import { AudioMasterChannel } from '../../state/audio'

export class AudioMixerMasterCommand extends AbstractCommand {
	static MaskFlags = {
		gain: 1 << 0,
		balance: 1 << 1,
		followFadeToBlack: 1 << 2
	}
	static readonly rawName = 'CAMM'

	properties: Partial<AudioMasterChannel>

	constructor () {
		super()

		this.properties = {}
	}

	serialize () {
		const buffer = Buffer.alloc(8)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt16BE(Util.DecibelToUInt16BE(this.properties.gain || 0), 2)
		buffer.writeInt16BE(Util.BalanceToInt(this.properties.balance || 0), 4)
		buffer.writeUInt8(this.properties.followFadeToBlack ? 0x01 : 0x00 , 6) // Note: I never got this one to work
		return buffer
	}
}

export class AudioMixerMasterUpdateCommand extends AbstractCommand {
	static readonly rawName = 'AMMO'

	readonly properties: Readonly<AudioMasterChannel>

	constructor (properties: AudioMasterChannel) {
		super()

		this.properties = properties
	}

	static deserialize (rawCommand: Buffer): AudioMixerMasterUpdateCommand {
		const properties = {
			gain: Util.UInt16BEToDecibel(rawCommand.readUInt16BE(0)),
			balance: Util.IntToBalance(rawCommand.readInt16BE(2)),
			followFadeToBlack: rawCommand.readInt8(4) === 1
		}

		return new AudioMixerMasterUpdateCommand(properties)
	}

	applyToState (state: AtemState) {
		state.audio.master = {
			...state.audio.master,
			...this.properties
		}
		return `audio.master`
	}
}
