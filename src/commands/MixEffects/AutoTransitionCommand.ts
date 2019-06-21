import AbstractCommand from '../AbstractCommand'

export class AutoTransitionCommand extends AbstractCommand {
	rawName = 'DAut'
	mixEffect: number

	properties: null

	serialize () {
		return new Buffer([...Buffer.from(this.rawName), this.mixEffect, 0x00, 0x00, 0x00])
	}
}
