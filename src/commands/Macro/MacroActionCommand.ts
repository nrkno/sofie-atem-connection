import AbstractCommand from '../AbstractCommand'
import { MacroAction } from '../../enums'

export class MacroActionCommand extends AbstractCommand {
	rawName = 'MAct' // this seems unnecessary.
	index: number

	properties: {
		action: MacroAction
	}

	deserialize () {
		//
	}

	serialize () {
		const rawCommand = 'MAct'
		const buffer = new Buffer([...Buffer.from(rawCommand), 0x00, 0x00, this.properties.action, 0x00])
		switch (this.properties.action) {
			case MacroAction.Run :
			case MacroAction.Delete :
				buffer[4] = this.index >> 8
				buffer[5] = this.index & 0xff
				break
			default :
				break
		}
		return buffer
	}

	applyToState () {
		//
	}
}
