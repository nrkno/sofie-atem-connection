import AbstractCommand from '../AbstractCommand'

export class MediaPoolClearClipCommand extends AbstractCommand {
	rawName = 'CMPC'

	properties: {
		index: number
	}

	serialize () {
		return new Buffer([
			...Buffer.from(this.rawName),
			this.properties.index,
			0x00,
			0x00,
			0x00
		])
	}

	updateProps (props: { index: number }) {
		this._updateProps(props)
	}
}
