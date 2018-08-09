import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { Util } from '../../..'

export class TransitionPositionCommand extends AbstractCommand {
	rawName = 'TrPs' // this seems unnecessary.
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
