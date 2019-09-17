import AbstractCommand from './AbstractCommand'
import { AtemState } from '../state'

export class AuxSourceCommand extends AbstractCommand {
	rawName = 'CAuS'
	auxBus: number

	properties: {
		source: number
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(0x01, 0)
		buffer.writeUInt8(this.auxBus, 1)
		buffer.writeUInt16BE(this.properties.source, 2)
		return buffer
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
		return `video.auxilliaries.${this.auxBus}`
	}
}
