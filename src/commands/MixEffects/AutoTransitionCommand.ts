import AbstractCommand from '../AbstractCommand'
import { Util } from '../..'

export class AutoTransitionCommand extends AbstractCommand {
	rawName = 'DAut'
	mixEffect: number

	properties: null

	deserialize (rawCommand: Buffer) {
		this.mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
	}

	serialize () {
		const rawCommand = 'DAut'
		return new Buffer([...Buffer.from(rawCommand), this.mixEffect, 0x00, 0x00, 0x00])
	}

	applyToState () {
		// nothing
	}
}
