import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { Util } from '../..'

export class DownstreamKeySourcesCommand extends AbstractCommand {
	static readonly rawName = 'DskB'

	readonly downstreamKeyerId: number
	readonly properties: Readonly<{
		fillSource: number,
		cutSource: number
	}>

	constructor (downstreamKeyerId: number, properties: DownstreamKeySourcesCommand['properties']) {
		super()

		this.downstreamKeyerId = downstreamKeyerId
		this.properties = properties
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
