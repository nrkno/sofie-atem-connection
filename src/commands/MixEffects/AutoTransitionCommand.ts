import AbstractCommand from '../AbstractCommand'

export class AutoTransitionCommand extends AbstractCommand {
	rawName = 'DAut'
	mixEffect: number

	protected properties: null

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
	}

	serialize () {
		let rawCommand = 'DAut'
		return new Buffer([...Buffer.from(rawCommand), this.mixEffect, 0x00, 0x00, 0x00])
	}

	applyToState () {
		// nothing
	}
}
