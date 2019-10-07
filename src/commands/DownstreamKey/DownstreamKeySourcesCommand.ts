import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { Util } from '../..'
import { DownstreamKeyer } from '../../state/video/downstreamKeyers'

export class DownstreamKeySourcesCommand extends DeserializedCommand<DownstreamKeyer['sources']> {
	static readonly rawName = 'DskB'

	readonly downstreamKeyerId: number

	constructor (downstreamKeyerId: number, properties: DownstreamKeyer['sources']) {
		super(properties)

		this.downstreamKeyerId = downstreamKeyerId
	}

	static deserialize (rawCommand: Buffer) {
		const downstreamKeyerId = Util.parseNumberBetween(rawCommand[0], 0, 3)
		const properties = {
			fillSource: rawCommand.readUInt16BE(2),
			cutSource: rawCommand.readUInt16BE(4)
		}

		return new DownstreamKeySourcesCommand(downstreamKeyerId, properties)
	}

	applyToState (state: AtemState) {
		state.video.getDownstreamKeyer(this.downstreamKeyerId).sources = this.properties
		return `video.downstreamKeyers.${this.downstreamKeyerId}`
	}
}
