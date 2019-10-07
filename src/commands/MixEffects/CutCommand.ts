import { BasicWritableCommand } from '../CommandBase'

export class CutCommand extends BasicWritableCommand<null> {
	static readonly rawName = 'DCut'

	readonly mixEffect: number

	constructor (mixEffect: number) {
		super(null)

		this.mixEffect = mixEffect
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		return buffer
	}
}
