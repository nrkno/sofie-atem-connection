import { BasicWritableCommand } from '../CommandBase'

export class CutCommand extends BasicWritableCommand<null> {
	public static readonly rawName = 'DCut'

	public readonly mixEffect: number

	constructor (mixEffect: number) {
		super(null)

		this.mixEffect = mixEffect
	}

	public serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		return buffer
	}
}
