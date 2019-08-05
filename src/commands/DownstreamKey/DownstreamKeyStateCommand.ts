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

	applyToState (state: AtemState) {
		state.video.downstreamKeyers[this.downstreamKeyerId] = {
			...state.video.downstreamKeyers[this.downstreamKeyerId],
			...this.properties
		}
		return `video.downstreamKeyers.${this.downstreamKeyerId}`
	}
}
