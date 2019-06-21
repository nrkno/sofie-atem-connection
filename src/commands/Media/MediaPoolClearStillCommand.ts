import AbstractCommand from '../AbstractCommand'

export class MediaPoolClearStillCommand extends AbstractCommand {
	rawName = 'CSTL'

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
