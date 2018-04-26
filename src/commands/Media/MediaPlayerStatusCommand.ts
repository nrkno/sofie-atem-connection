import IAbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { MediaPlayer } from '../../state/media'
import AbstractCommand from '../AbstractCommand'

export class MediaPlayerStatusCommand extends AbstractCommand implements IAbstractCommand {
	rawName = 'RCPS'
	packetId: number

	flag: number

	mediaPlayerId: number

	MaskFlags = {
		playing: 1 << 0,
		loop: 1 << 1,
		atBeginning: 1 << 2,
		frame: 1 << 3
	}
	protected _properties: MediaPlayer

	get properties () {
		return this._properties
	}

	updateProps (newProps: Partial<MediaPlayer>) {
		this._updateProps(newProps)
	}

	deserialize (rawCommand: Buffer) {
		this.mediaPlayerId = rawCommand[0]
		this._properties = {
			playing: rawCommand[1] === 1,
			loop: rawCommand[2] === 1,
			atBeginning: rawCommand[3] === 1,
			clipFrame: rawCommand[4] << 8 | (rawCommand[5])
		}
	}

	serialize () {
		let rawCommand = 'SCPS'
		return new Buffer([
			...Buffer.from(rawCommand),
			this.flag,
			this.mediaPlayerId,
			this.properties.playing,
			this.properties.loop,
			this.properties.atBeginning,
			0x00,
			this.properties.clipFrame >> 8,
			this.properties.clipFrame & 0xFF
		])
	}

	getAttributes () {
		return {
			mediaPlayerId: this.mediaPlayerId,
			...this.properties
		}
	}

	applyToState (state: AtemState) {
		state.media.players[this.mediaPlayerId] = {
			...this.properties
		}
	}
}
