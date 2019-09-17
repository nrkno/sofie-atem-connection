import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { Util } from '../..'

export class DownstreamKeySourcesCommand extends AbstractCommand {
	rawName = 'DskB'
	downstreamKeyerId: number
	properties: {
		fillSource: number,
		cutSource: number
	}

	deserialize (rawCommand: Buffer) {
		this.downstreamKeyerId = Util.parseNumberBetween(rawCommand[0], 0, 3),
		this.properties = {
			fillSource: rawCommand.readUInt16BE(2),
			cutSource: rawCommand.readUInt16BE(4)
		}
	}

	applyToState (state: AtemState) {
		state.video.getDownstreamKeyer(this.downstreamKeyerId).sources = this.properties
		return `video.downstreamKeyers.${this.downstreamKeyerId}`
	}
}
