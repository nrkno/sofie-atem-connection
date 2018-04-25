import IAbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'

export class DownstreamKeyStateCommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = 'DskS'
	packetId: number

	downstreamKeyId: number
	onAir: boolean
	inTransition: boolean
	isAuto: boolean
	remainingFrames: number

	deserialize (rawCommand: Buffer) {
		this.downstreamKeyId = rawCommand[0]
		this.onAir = rawCommand[1] === 1
		this.inTransition = rawCommand[2] === 1
		this.isAuto = rawCommand[3] === 1
		this.remainingFrames = rawCommand[4]
	}

	serialize () {
		return new Buffer(0) // bad. don't do this.
	}

	getAttributes () {
		return {
			downstreamKeyId: this.downstreamKeyId,
			onAir: this.onAir,
			inTransition: this.inTransition,
			isAuto: this.isAuto,
			remainingFrames: this.remainingFrames
		}
	}

	applyToState (state: AtemState) {
		let object = this.getAttributes()
		delete object.downstreamKeyId
		state.video.downstreamKeyers[this.downstreamKeyId] = object
	}
}
