import { BasicWritableCommand } from '../CommandBase'

export class MediaPoolClearClipCommand extends BasicWritableCommand<{ index: number }> {
	static readonly rawName = 'CMPC'

	constructor (index: number) {
		super({ index })
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.properties.index, 0)
		return buffer
	}
}
