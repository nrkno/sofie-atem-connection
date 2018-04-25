import IAbstractCommand from '../AbstractCommand'
import { AtemState } from '../../lib/atemState'

export class ProgramInputCommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = 'PrgI'
	packetId: number

	source: number
	mixEffect: number

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
		this.source = rawCommand.readUInt8(2)
	}

	serialize () {
		let rawCommand = 'CPgI'
		return new Buffer([...Buffer.from(rawCommand), this.mixEffect, 0x00, this.source >> 8, this.source & 0xFF])
	}

	getAttributes () {
		return {
			mixEffect: this.mixEffect,
			source: this.source
		}
	}

	applyToState (state: AtemState) {
		let mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.programInput = this.source
	}
}
