import IAbstractCommand from '../AbstractCommand'

export class CutCommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = 'DCut' // this seems unnecessary.
	packetId: number

	mixEffect: number

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
	}

	serialize () {
		let rawCommand = 'DCut'
		return new Buffer([...Buffer.from(rawCommand), this.mixEffect, 0xef, 0xbf, 0x5f])
	}

	getAttributes () {
		return {
			mixEffect: this.mixEffect
		}
	}

	applyToState () {
		// nothing
	}
}
