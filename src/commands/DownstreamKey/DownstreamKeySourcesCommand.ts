import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { DownstreamKeyer } from '../../state/video/downstreamKeyers'

export class DownstreamKeySourcesCommand extends DeserializedCommand<DownstreamKeyer['sources']> {
	public static readonly rawName = 'DskB'

	public readonly downstreamKeyerId: number

	constructor (downstreamKeyerId: number, properties: DownstreamKeyer['sources']) {
		super(properties)

		this.downstreamKeyerId = downstreamKeyerId
	}

	public static deserialize (rawCommand: Buffer) {
		const downstreamKeyerId = rawCommand.readUInt8(0)
		const properties = {
			fillSource: rawCommand.readUInt16BE(2),
			cutSource: rawCommand.readUInt16BE(4)
		}

		return new DownstreamKeySourcesCommand(downstreamKeyerId, properties)
	}

	public applyToState (state: AtemState) {
		state.video.getDownstreamKeyer(this.downstreamKeyerId).sources = this.properties
		return `video.downstreamKeyers.${this.downstreamKeyerId}`
	}
}
