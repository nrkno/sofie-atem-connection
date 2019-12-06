import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { DownstreamKeyerBase } from '../../state/video/downstreamKeyers'
import { ProtocolVersion } from '../../enums'

export class DownstreamKeyStateCommand extends DeserializedCommand<DownstreamKeyerBase> {
	public static readonly rawName = 'DskS'

	public readonly downstreamKeyerId: number

	constructor (downstreamKeyerId: number, properties: DownstreamKeyerBase) {
		super(properties)

		this.downstreamKeyerId = downstreamKeyerId
	}

	public static deserialize (rawCommand: Buffer) {
		const downstreamKeyerId = rawCommand[0]
		const properties = {
			onAir: rawCommand[1] === 1,
			inTransition: rawCommand[2] === 1,
			isAuto: rawCommand[3] === 1,
			remainingFrames: rawCommand[4]
		}

		return new DownstreamKeyStateCommand(downstreamKeyerId, properties)
	}

	public applyToState (state: AtemState) {
		if (!state.info.capabilities || this.downstreamKeyerId >= state.info.capabilities.downstreamKeyers) {
			throw new Error(`DownstreamKeyer ${this.downstreamKeyerId} is not valid`)
		}

		state.video.downstreamKeyers[this.downstreamKeyerId] = {
			...state.video.getDownstreamKeyer(this.downstreamKeyerId),
			...this.properties
		}
		return `video.downstreamKeyers.${this.downstreamKeyerId}`
	}
}

export class DownstreamKeyStateV8Command extends DeserializedCommand<DownstreamKeyerBase> {
	public static readonly rawName = 'DskS'
	public static readonly minimumVersion = ProtocolVersion.V8_0_1

	public readonly downstreamKeyerId: number

	constructor (downstreamKeyerId: number, properties: DownstreamKeyerBase) {
		super(properties)

		this.downstreamKeyerId = downstreamKeyerId
	}

	public static deserialize (rawCommand: Buffer) {
		const downstreamKeyerId = rawCommand[0]
		const properties = {
			onAir: rawCommand[1] === 1,
			inTransition: rawCommand[2] === 1,
			isAuto: rawCommand[3] === 1,
			isTowardsOnAir: rawCommand[4] === 1,
			remainingFrames: rawCommand[5]
		}

		return new DownstreamKeyStateV8Command(downstreamKeyerId, properties)
	}

	public applyToState (state: AtemState) {
		if (!state.info.capabilities || this.downstreamKeyerId >= state.info.capabilities.downstreamKeyers) {
			throw new Error(`DownstreamKeyer ${this.downstreamKeyerId} is not valid`)
		}

		state.video.downstreamKeyers[this.downstreamKeyerId] = {
			...state.video.getDownstreamKeyer(this.downstreamKeyerId),
			...this.properties
		}
		return `video.downstreamKeyers.${this.downstreamKeyerId}`
	}
}
