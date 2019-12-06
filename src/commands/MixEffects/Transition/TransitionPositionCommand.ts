import { BasicWritableCommand, DeserializedCommand } from '../../CommandBase'
import { AtemState } from '../../../state'

export interface HandlePositionProps {
	handlePosition: number // 0...10000
}

export class TransitionPositionCommand extends BasicWritableCommand<HandlePositionProps> {
	public static readonly rawName = 'CTPs'

	public readonly mixEffect: number

	constructor (mixEffect: number, handlePosition: number) {
		super({ handlePosition })

		this.mixEffect = mixEffect
	}

	public serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		buffer.writeUInt16BE(this.properties.handlePosition, 2)
		return buffer
	}
}

export interface TransitionPositionProps extends HandlePositionProps {
	inTransition: boolean
	remainingFrames: number // 0...250
}

export class TransitionPositionUpdateCommand extends DeserializedCommand<TransitionPositionProps> {
	public static readonly rawName = 'TrPs'

	public readonly mixEffect: number

	constructor (mixEffect: number, properties: TransitionPositionProps) {
		super(properties)

		this.mixEffect = mixEffect
	}

	public static deserialize (rawCommand: Buffer): TransitionPositionUpdateCommand {
		const mixEffect = rawCommand[0]
		const properties = {
			inTransition: rawCommand[1] === 1,
			remainingFrames: rawCommand[2],
			handlePosition: rawCommand.readUInt16BE(4)
		}

		return new TransitionPositionUpdateCommand(mixEffect, properties)
	}

	public applyToState (state: AtemState) {
		if (!state.info.capabilities || this.mixEffect >= state.info.capabilities.mixEffects) {
			throw new Error(`MixEffect ${this.mixEffect} is not valid`)
		}

		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionFramesLeft = this.properties.remainingFrames
		mixEffect.transitionPosition = this.properties.handlePosition
		mixEffect.inTransition = this.properties.inTransition
		return `video.ME.${this.mixEffect}.transition`
	}
}
