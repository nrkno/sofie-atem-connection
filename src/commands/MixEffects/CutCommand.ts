import AbstractCommand from '../AbstractCommand'
import { Util } from '../..'

export class CutCommand extends AbstractCommand {
	rawName = 'DCut'
	mixEffect: number

	properties: null

	deserialize (rawCommand: Buffer) {
		this.mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
	}

	serialize () {
		const rawCommand = 'DCut'
		return new Buffer([...Buffer.from(rawCommand), this.mixEffect, 0xef, 0xbf, 0x5f])
	}

	applyToState () {
		// nothing
	}
}
