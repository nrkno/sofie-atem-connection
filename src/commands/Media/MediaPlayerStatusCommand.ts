import IAbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'

export class MediaPlayerStatusCommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = 'RCPS'
	packetId: number

	flag: number

	mediaPlayerId: number
	playing: boolean
	loop: boolean
	atBeginning: boolean
	clipFrame: number

	MaskFlags = {
		Playing : 1 << 0,
		Loop: 1 << 1,
		Beginning: 1 << 2,
		Frame: 1 << 3
	}

	deserialize (rawCommand: Buffer) {
		this.mediaPlayerId = rawCommand[0]
		this.playing = rawCommand[1] === 1
		this.loop = rawCommand[2] === 1
		this.atBeginning = rawCommand[3] === 1
		this.clipFrame = rawCommand[4] << 8 | (rawCommand[5])
	}

	serialize () {
		let rawCommand = 'SCPS'
		return new Buffer([
			...Buffer.from(rawCommand),
			this.flag,
			this.mediaPlayerId,
			this.playing,
			this.loop,
			this.atBeginning,
			0x00,
			this.clipFrame >> 8,
			this.clipFrame & 0xFF
		])
	}

	getAttributes () {
		return {
			mediaPlayerId: this.mediaPlayerId,
			playing: this.playing,
			loop: this.loop,
			atBeginning: this.atBeginning,
			clipFrame: this.clipFrame
		}
	}

	applyToState (state: AtemState) {
		let object = this.getAttributes()
		delete object.mediaPlayerId
		state.media.players[this.mediaPlayerId] = object
	}
}
