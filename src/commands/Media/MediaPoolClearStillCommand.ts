import AbstractCommand from '../AbstractCommand'

export class MediaPoolClearStillCommand extends AbstractCommand {
	static readonly rawName = 'CSTL'

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
