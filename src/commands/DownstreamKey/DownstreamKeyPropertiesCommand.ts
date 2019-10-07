import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { DownstreamKeyerProperties } from '../../state/video/downstreamKeyers'
import { Util } from '../..'

export class DownstreamKeyPropertiesCommand extends AbstractCommand {
	static readonly rawName = 'DskP'

	readonly downstreamKeyerId: number
	readonly properties: Readonly<DownstreamKeyerProperties>

	constructor (downstreamKeyerId: number, properties: DownstreamKeyerProperties) {
		super()

		this.downstreamKeyerId = downstreamKeyerId
		this.properties = properties
	}

	static deserialize (rawCommand: Buffer) {
		const downstreamKeyerId = rawCommand[0]
		const properties = {
			tie: rawCommand[1] === 1,
			rate: Util.parseNumberBetween(rawCommand[2], 0, 300),

			preMultiply: rawCommand[3] === 1,
			clip: Util.parseNumberBetween(rawCommand.readUInt16BE(4), 0, 1000),
			gain: Util.parseNumberBetween(rawCommand.readUInt16BE(6), 0, 1000),
			invert: rawCommand[8] === 1,

			mask: {
				enabled: rawCommand[9] === 1,
				top: Util.parseNumberBetween(rawCommand.readInt16BE(10), -9000, 9000),
				bottom: Util.parseNumberBetween(rawCommand.readInt16BE(12), -9000, 9000),
				left: Util.parseNumberBetween(rawCommand.readInt16BE(14), -16000, 16000),
				right: Util.parseNumberBetween(rawCommand.readInt16BE(16), -16000, 16000)
			}
		}

		return new DownstreamKeyPropertiesCommand(downstreamKeyerId, properties)
	}

	applyToState (state: AtemState) {
		state.video.getDownstreamKeyer(this.downstreamKeyerId).properties = this.properties
		return `video.downstreamKeyers.${this.downstreamKeyerId}`
	}
}
