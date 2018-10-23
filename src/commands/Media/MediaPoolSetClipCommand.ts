import AbstractCommand from '../AbstractCommand'

export class MediaPoolSetClipCommand extends AbstractCommand {
	rawName = 'SMPC'

	properties: {
		index: number,
		name: string,
		frames: number
	}

	serialize () {
		const buffer = new Buffer(68)
		buffer[0] = 3
		buffer[1] = this.properties.index
		buffer.write(this.properties.name, 2, 44)
		buffer.writeUInt16BE(this.properties.frames, 66)

		return Buffer.concat([ Buffer.from('SMPC', 'ascii'), buffer ])
	}

	updateProps (props: { index: number, name: string, frames: number }) {
		this._updateProps(props)
	}
}
