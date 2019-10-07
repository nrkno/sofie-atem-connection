import AbstractCommand from '../AbstractCommand'

export class MediaPoolClearClipCommand extends AbstractCommand {
	static readonly rawName = 'CMPC'

	properties: {
		index: number
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.properties.index, 0)
		return buffer
	}

	updateProps (props: { index: number }) {
		this._updateProps(props)
	}
}
