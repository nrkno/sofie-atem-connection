import IAbstractCommand from '../AbstractCommand'

export class MacroActionCommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = 'MAct' // this seems unnecessary.
	packetId: number

	index: number
	action: number // MacroAction

	MacroAction = {
		Run: 0,
		Stop: 1,
		StopRecord: 2,
		InsertUserWait: 3,
		Continue: 4,
		Delete: 5
	}

	deserialize () {
		//
	}

	serialize () {
		let rawCommand = 'MAct'
		let buffer = new Buffer([...Buffer.from(rawCommand), 0x00, 0x00, this.action, 0x00])
		switch (this.action) {
			case this.MacroAction.Run :
			case this.MacroAction.Delete :
				buffer[4] = this.index >> 8
				buffer[5] = this.index & 0xff
				break
			default :
				break
		}
		return buffer
	}

	getAttributes () {
		return {}
	}

	applyToState () {
		//
	}
}
