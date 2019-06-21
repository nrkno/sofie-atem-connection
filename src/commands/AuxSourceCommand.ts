import AbstractCommand from './AbstractCommand'
import { AtemState } from '../state'

export class AuxSourceCommand extends AbstractCommand {
	rawName = 'CAuS'
	auxBus: number

	properties: {
		source: number
	}

	serialize () {
		return new Buffer([
			...Buffer.from(this.rawName),
			0x01, // 'Set source' flags
			this.auxBus,
			this.properties.source >> 8,
			this.properties.source & 0xFF
		])
	}
}

export class AuxSourceUpdateCommand extends AbstractCommand {
	rawName = 'AuxS'
	auxBus: number

	properties: {
		source: number
	}

	deserialize (rawCommand: Buffer) {
		this.auxBus = rawCommand[0]
		this.properties = {
			source: rawCommand.readUInt16BE(2)
		}
	}

	applyToState (state: AtemState) {
		state.video.auxilliaries[this.auxBus] = this.properties.source
	}
}
