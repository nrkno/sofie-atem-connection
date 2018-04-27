import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'

export class TransitionPositionCommand extends AbstractCommand {
	rawName = 'TrPs' // this seems unnecessary.
	mixEffect: number

	properties: {
		readonly inTransition: boolean
		readonly remainingFrames: number // 0...250
		handlePosition: number // 0...9999
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
		this.properties = {
			inTransition: rawCommand[1] === 1,
			remainingFrames: rawCommand[2],
			handlePosition: rawCommand[4] << 8 | rawCommand[4]
		}
	}

	serialize () {
		const rawCommand = 'CTPs'
		return new Buffer([
			...Buffer.from(rawCommand),
			this.mixEffect,
			0x00,
			this.properties.handlePosition >> 8,
			this.properties.handlePosition & 0xff
		])
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionFramesLeft = this.properties.remainingFrames
		mixEffect.transitionPosition = this.properties.handlePosition
		mixEffect.inTransition = this.properties.inTransition
	}
}
