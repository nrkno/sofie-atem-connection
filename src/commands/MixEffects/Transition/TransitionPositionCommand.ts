import AbstractCommand, { BasicWritableCommand } from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { Util } from '../../..'

export interface HandlePositionProps {
	handlePosition: number // 0...10000
}

export class TransitionPositionCommand extends BasicWritableCommand<HandlePositionProps> {
	static readonly rawName = 'CTPs'

	readonly mixEffect: number

	constructor (mixEffect: number, handlePosition: number) {
		super()

		this.mixEffect = mixEffect
		this.properties = { handlePosition }
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		buffer.writeUInt16BE(this.properties.handlePosition, 2)
		return buffer
	}
}

export class TransitionPositionUpdateCommand extends AbstractCommand {
	static readonly rawName = 'TrPs'

	readonly mixEffect: number
	readonly properties: Readonly<{
		inTransition: boolean
		remainingFrames: number // 0...250
		handlePosition: number // 0...10000
	}>

	constructor (mixEffect: number, properties: TransitionPositionUpdateCommand['properties']) {
		super()

		this.mixEffect = mixEffect
		this.properties = properties
	}

	static deserialize (rawCommand: Buffer): TransitionPositionUpdateCommand {
		const mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		const properties = {
			inTransition: rawCommand[1] === 1,
			remainingFrames: Util.parseNumberBetween(rawCommand[2], 0, 250),
			handlePosition: Util.parseNumberBetween(rawCommand.readUInt16BE(4), 0, 10000)
		}

		return new TransitionPositionUpdateCommand(mixEffect, properties)
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionFramesLeft = this.properties.remainingFrames
		mixEffect.transitionPosition = this.properties.handlePosition
		mixEffect.inTransition = this.properties.inTransition
		return `video.ME.${this.mixEffect}.transition`
	}
}
