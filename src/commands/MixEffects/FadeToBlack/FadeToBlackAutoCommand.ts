import AbstractCommand from '../../AbstractCommand'

export class FadeToBlackAutoCommand extends AbstractCommand {
	static readonly rawName = 'FtbA'
	mixEffect: number

	properties: {}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		return buffer
	}
}
