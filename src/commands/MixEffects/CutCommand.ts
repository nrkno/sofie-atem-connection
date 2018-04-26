import AbstractCommand from '../AbstractCommand'

export class CutCommand extends AbstractCommand {
	rawName = 'DCut'
	mixEffect: number

	protected properties: null

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
	}

	serialize () {
		let rawCommand = 'DCut'
		return new Buffer([...Buffer.from(rawCommand), this.mixEffect, 0xef, 0xbf, 0x5f])
	}

	applyToState () {
		// nothing
	}
}
