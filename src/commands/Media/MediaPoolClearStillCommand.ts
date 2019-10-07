import { BasicWritableCommand } from '../CommandBase'

export class MediaPoolClearStillCommand extends BasicWritableCommand<{ index: number }> {
	static readonly rawName = 'CSTL'

	constructor (index: number) {
		super({ index })
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.properties.index, 0)
		return buffer
	}
}
