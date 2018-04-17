import IAbstractCommand from '../AbstractCommand'

export class AutoTransitionCommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = 'DAut' // this seems unnecessary.
	packetId: number

	mixEffect: number

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
	}

	serialize () {
		let rawCommand = 'DAut'
		return new Buffer([...Buffer.from(rawCommand), this.mixEffect, 0x00, 0x00, 0x00])
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
