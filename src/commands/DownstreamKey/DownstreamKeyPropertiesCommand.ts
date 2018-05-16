import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { DownstreamKeyerProperties } from '../../state/video/downstreamKeyers'

export class DownstreamKeyPropertiesCommand extends AbstractCommand {
	rawName = 'DskP'
	downstreamKeyerId: number
	properties: DownstreamKeyerProperties

	deserialize (rawCommand: Buffer) {
		this.downstreamKeyerId = rawCommand[0]
		this.properties = {
			tie: rawCommand[1] === 1,
			rate: rawCommand[2],

			preMultiply: rawCommand[3] === 1,
			clip: rawCommand.readUInt16BE(4),
			gain: rawCommand.readUInt16BE(6),
			invert: rawCommand[8] === 1,

			mask: {
				enabled: rawCommand[9] === 1,
				top: rawCommand.readInt16BE(10),
				bottom: rawCommand.readInt16BE(12),
				left: rawCommand.readInt16BE(14),
				right: rawCommand.readInt16BE(16)
			}
		}
	}

	applyToState (state: AtemState) {
		state.video.getDownstreamKeyer(this.downstreamKeyerId).properties = this.properties
	}
}
