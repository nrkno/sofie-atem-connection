import AbstractCommand from '../AbstractCommand'

export class MediaPoolClearClipCommand extends AbstractCommand {
	rawName = 'CMPC'

	properties: {
		index: number
	}

	serialize () {
		const rawCommand = 'CMPC'
		return new Buffer([
			...Buffer.from(rawCommand),
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
