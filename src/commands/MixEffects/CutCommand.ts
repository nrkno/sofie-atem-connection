import AbstractCommand from '../AbstractCommand'

export class CutCommand extends AbstractCommand {
	static readonly rawName = 'DCut'
	mixEffect: number

	properties: null

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		return buffer
	}
}
