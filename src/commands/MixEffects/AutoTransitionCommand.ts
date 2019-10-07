import AbstractCommand from '../AbstractCommand'

export class AutoTransitionCommand extends AbstractCommand {
	static readonly rawName = 'DAut'
	mixEffect: number

	properties: null

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		return buffer
	}
}
