import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { DownstreamKeyerBase } from '../../state/video/downstreamKeyers'
import { Util } from '../..'
import { ProtocolVersion } from '../../enums'

export class DownstreamKeyStateCommand extends DeserializedCommand<DownstreamKeyerBase> {
	static readonly rawName = 'DskS'

	readonly downstreamKeyerId: number

	constructor (downstreamKeyerId: number, properties: DownstreamKeyerBase) {
		super(properties)

		this.downstreamKeyerId = downstreamKeyerId
	}

	static deserialize (rawCommand: Buffer) {
		const downstreamKeyerId = Util.parseNumberBetween(rawCommand[0], 0, 3)
		const properties = {
			onAir: rawCommand[1] === 1,
			inTransition: rawCommand[2] === 1,
			isAuto: rawCommand[3] === 1,
			remainingFrames: rawCommand[4]
		}

		return new DownstreamKeyStateCommand(downstreamKeyerId, properties)
	}

	applyToState (state: AtemState) {
		state.video.downstreamKeyers[this.downstreamKeyerId] = {
			...state.video.getDownstreamKeyer(this.downstreamKeyerId),
			...this.properties
		}
		return `video.downstreamKeyers.${this.downstreamKeyerId}`
	}
}

export class DownstreamKeyStateV8Command extends DeserializedCommand<DownstreamKeyerBase> {
	static readonly rawName = 'DskS'
	static readonly minimumVersion = ProtocolVersion.V8_0_1

	readonly downstreamKeyerId: number

	constructor (downstreamKeyerId: number, properties: DownstreamKeyerBase) {
		super(properties)

		this.downstreamKeyerId = downstreamKeyerId
	}

	static deserialize (rawCommand: Buffer) {
		const downstreamKeyerId = Util.parseNumberBetween(rawCommand[0], 0, 3)
		const properties = {
			onAir: rawCommand[1] === 1,
			inTransition: rawCommand[2] === 1,
			isAuto: rawCommand[3] === 1,
			isTowardsOnAir: rawCommand[4] === 1,
			remainingFrames: rawCommand[5]
		}

		return new DownstreamKeyStateV8Command(downstreamKeyerId, properties)
	}

	applyToState (state: AtemState) {
		state.video.downstreamKeyers[this.downstreamKeyerId] = {
			...state.video.getDownstreamKeyer(this.downstreamKeyerId),
			...this.properties
		}
		return `video.downstreamKeyers.${this.downstreamKeyerId}`
	}
}
