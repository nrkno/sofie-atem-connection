import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { DownstreamKeyerBase } from '../../state/video/downstreamKeyers'
import { Util } from '../..'

export class DownstreamKeyStateCommand extends AbstractCommand {
	rawName = 'DskS'
	downstreamKeyerId: number

	properties: DownstreamKeyerBase

	deserialize (rawCommand: Buffer) {
		this.downstreamKeyerId = Util.parseNumberBetween(rawCommand[0], 0, 3)
		this.properties = {
			onAir: rawCommand[1] === 1,
			inTransition: rawCommand[2] === 1,
			isAuto: rawCommand[3] === 1,
			remainingFrames: rawCommand[4]
		}
	}

	serialize () {
		// TODO(Lange - 2018-04-26): Commands such as this one don't have a corresponding serialize companion.
		// Perhaps we should restructure the code to make commands like this less awkward, and avoid
		// needing to define a stub serialize method.
		return new Buffer(0)
	}

	applyToState (state: AtemState) {
		state.video.downstreamKeyers[this.downstreamKeyerId] = {
			...state.video.downstreamKeyers[this.downstreamKeyerId],
			...this.properties
		}
	}
}
