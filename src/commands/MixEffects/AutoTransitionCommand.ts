import AbstractCommand from '../AbstractCommand'

export class AutoTransitionCommand extends AbstractCommand {
	rawName = 'DAut'
	mixEffect: number

	properties: null

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
	}

	serialize () {
		const rawCommand = 'DAut'
		return new Buffer([...Buffer.from(rawCommand), this.mixEffect, 0x00, 0x00, 0x00])
	}

	applyToState () {
		// nothing
	}
}
