import AbstractCommand from '../../AbstractCommand'

export class FadeToBlackAutoCommand extends AbstractCommand {
	rawName = 'FtbP'
	mixEffect: number

	properties: {}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)

		return Buffer.concat([
			Buffer.from('FtbA'),
			buffer
		])
	}
}
