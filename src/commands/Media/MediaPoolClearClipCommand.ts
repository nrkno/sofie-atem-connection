import { BasicWritableCommand } from '../CommandBase'

export class MediaPoolClearClipCommand extends BasicWritableCommand<{ index: number }> {
	public static readonly rawName = 'CMPC'

	constructor (index: number) {
		super({ index })
	}

	public serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.properties.index, 0)
		return buffer
	}
}
