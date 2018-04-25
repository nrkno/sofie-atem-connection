import IAbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { DownstreamKeyer } from '../../state/video'

export class DownstreamKeyStateCommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = 'DskS'
	packetId: number

	downstreamKeyId: number
	properties: DownstreamKeyer

	deserialize (rawCommand: Buffer) {
		this.downstreamKeyId = rawCommand[0]
		this.properties = {
			onAir: rawCommand[1] === 1,
			inTransition: rawCommand[2] === 1,
			isAuto: rawCommand[3] === 1,
			remainingFrames: rawCommand[4]
		}
	}

	serialize () {
		return new Buffer(0) // bad. don't do this.
	}

	getAttributes () {
		return {
			downstreamKeyId: this.downstreamKeyId,
			...this.properties
		}
	}

	applyToState (state: AtemState) {
		state.video.downstreamKeyers[this.downstreamKeyId] = {
			...this.properties
		}
	}
}
