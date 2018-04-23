import IAbstractCommand from '../AbstractCommand'

export class DownstreamKeyTieCommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = 'CDsT' // this seems unnecessary.
	packetId: number

	downstreamKeyId: number
	tie: boolean

	deserialize () {
		// nothing
	}

	serialize () {
		let rawCommand = 'CDsT'
		return new Buffer([...Buffer.from(rawCommand), this.downstreamKeyId, this.tie, 0x00, 0x00])
	}

	getAttributes () {
		return {}
	}

	applyToState () {
		// nothing
	}
}
