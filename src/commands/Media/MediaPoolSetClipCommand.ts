import { BasicWritableCommand } from '../CommandBase'

export interface MediaPoolSetClipProps {
	index: number,
	name: string,
	frames: number
}

export class MediaPoolSetClipCommand extends BasicWritableCommand<MediaPoolSetClipProps> {
	public static readonly rawName = 'SMPC'

	public serialize () {
		const buffer = Buffer.alloc(68)
		buffer.writeUInt8(3, 0)
		buffer.writeUInt8(this.properties.index, 1)
		buffer.write(this.properties.name, 2, 44)
		buffer.writeUInt16BE(this.properties.frames, 66)
		return buffer
	}
}
