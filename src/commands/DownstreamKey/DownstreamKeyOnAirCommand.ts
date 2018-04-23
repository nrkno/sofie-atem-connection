import IAbstractCommand from '../AbstractCommand'

export class DownstreamKeyOnAirCommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = 'CDsL' // this seems unnecessary.
	packetId: number

	downstreamKeyId: number
	onair: boolean

	deserialize () {
		// nothing
	}

	serialize () {
		let rawCommand = 'CDsL'
		return new Buffer([...Buffer.from(rawCommand), this.downstreamKeyId, this.onair, 0x00, 0x00])
	}

	getAttributes () {
		return {}
	}

	applyToState () {
		// nothing
	}
}
