import IAbstractCommand from '../AbstractCommand'

export class DownstreamKeyAutoCommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = 'DDsA' // this seems unnecessary.
	packetId: number

	downstreamKeyId: number

	deserialize () {
		// nothing
	}

	serialize () {
		let rawCommand = 'DDsA'
		return new Buffer([...Buffer.from(rawCommand), this.downstreamKeyId, 0x00, 0x00, 0x00])
	}

	getAttributes () {
		return {}
	}

	applyToState () {
		// nothing
	}
}
