import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'

export class DownstreamKeySourcesCommand extends AbstractCommand {
	rawName = 'DskB'
	downstreamKeyerId: number
	properties: {
		fillSource: number,
		cutSource: number
	}

	deserialize (rawCommand: Buffer) {
		this.downstreamKeyerId = rawCommand[0]
		this.properties = {
			fillSource: rawCommand.readInt16BE(2),
			cutSource: rawCommand.readInt16BE(4)
		}
	}

	applyToState (state: AtemState) {
		state.video.getDownstreamKeyer(this.downstreamKeyerId).sources = this.properties
	}
}
