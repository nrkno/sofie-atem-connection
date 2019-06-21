import AbstractCommand from '../AbstractCommand'

export class CutCommand extends AbstractCommand {
	rawName = 'DCut'
	mixEffect: number

	properties: null

	serialize () {
		return new Buffer([...Buffer.from(this.rawName), this.mixEffect, 0x00, 0x00, 0x00])
	}
}
