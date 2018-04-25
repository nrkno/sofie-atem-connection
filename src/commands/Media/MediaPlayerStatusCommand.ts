import IAbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { MediaPlayer } from '../../state/media'

export class MediaPlayerStatusCommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = 'RCPS'
	packetId: number

	flag: number

	mediaPlayerId: number
	properties: MediaPlayer

	MaskFlags = {
		Playing: 1 << 0,
		Loop: 1 << 1,
		Beginning: 1 << 2,
		Frame: 1 << 3
	}

	deserialize (rawCommand: Buffer) {
		this.mediaPlayerId = rawCommand[0]
		this.properties = {
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

	calcFlags (newProps: Partial<MediaPlayer>) {
		let flags = 0

		if ('playing' in newProps) {
			flags = flags | this.MaskFlags.Playing
		}
		if ('loop' in newProps) {
			flags = flags | this.MaskFlags.Loop
		}
		if ('atBeginning' in newProps) {
			flags = flags | this.MaskFlags.Beginning
		}
		if ('clipFrame' in newProps) {
			flags = flags | this.MaskFlags.Frame
		}

		return flags
	}

	applyToState (state: AtemState) {
		state.media.players[this.mediaPlayerId] = {
			...this.properties
		}
	}
}
