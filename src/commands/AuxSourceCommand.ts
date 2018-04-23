import IAbstractCommand from './AbstractCommand'
import { AtemState } from '../lib/atemState'
import { Util } from '../lib/atemUtil'

export class AuxSourceCommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = 'AuxS'
	packetId: number

	auxBus: number
	source: number

	deserialize (rawCommand: Buffer) {
		this.auxBus = rawCommand[0]
		this.source = Util.parseNumber(rawCommand.slice(2, 4))
	}

	serialize () {
		let rawCommand = 'CAuS'
		return new Buffer([...Buffer.from(rawCommand), 0x01, this.auxBus, this.source >> 8, this.source & 0xFF])
	}

	getAttributes () {
		return {
			auxBus: this.auxBus,
			source: this.source
		}
	}

	applyToState (state: AtemState) {
		state.video.auxilliaries[this.auxBus] = this.source
	}
}
