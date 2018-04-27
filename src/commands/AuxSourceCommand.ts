import AbstractCommand from './AbstractCommand'
import { AtemState } from '../state'

export class AuxSourceCommand extends AbstractCommand {
	rawName = 'AuxS'
	auxBus: number

	properties: {
		source: number
	}

	deserialize (rawCommand: Buffer) {
		this.auxBus = rawCommand[0]
		this.properties = {
			source: rawCommand.readUInt8(2)
		}
	}

	serialize () {
		const rawCommand = 'CAuS'
		return new Buffer([
			...Buffer.from(rawCommand),
			0x01,
			this.auxBus,
			this.properties.source >> 8,
			this.properties.source & 0xFF
		])
	}

	applyToState (state: AtemState) {
		state.video.auxilliaries[this.auxBus] = this.properties.source
	}
}
