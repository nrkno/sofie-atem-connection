import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { Util } from '../../..'

export class TransitionPositionCommand extends AbstractCommand {
	rawName = 'CTPs'
	mixEffect: number

	properties: {
		readonly inTransition: boolean
		readonly remainingFrames: number // 0...250
		handlePosition: number // 0...10000
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		buffer.writeUInt16BE(this.properties.handlePosition, 2)
		return buffer
	}
}

export class TransitionPositionUpdateCommand extends AbstractCommand {
	rawName = 'TrPs'
	mixEffect: number

	properties: {
		readonly inTransition: boolean
		readonly remainingFrames: number // 0...250
		handlePosition: number // 0...10000
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		this.properties = {
			inTransition: rawCommand[1] === 1,
			remainingFrames: Util.parseNumberBetween(rawCommand[2], 0, 250),
			handlePosition: Util.parseNumberBetween(rawCommand.readUInt16BE(4), 0, 10000)
		}
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionFramesLeft = this.properties.remainingFrames
		mixEffect.transitionPosition = this.properties.handlePosition
		mixEffect.inTransition = this.properties.inTransition
		return `video.ME.${this.mixEffect}.transition`
	}
}
