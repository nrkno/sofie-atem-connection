import AbstractCommand from './AbstractCommand'
import { AtemState } from '../state'
import { TimeInfo } from '../state/info'
import * as Enums from '../enums'

export class TimeCommand extends AbstractCommand {
	rawName = 'Time'

	properties: TimeInfo = {
		hour: 0,
		minute: 0,
		second: 0,
		frame: 0
	}

	serialize () {
		const buffer = Buffer.alloc(8)
		buffer.writeUInt8(this.properties.hour, 0)
		buffer.writeUInt8(this.properties.minute, 1)
		buffer.writeUInt8(this.properties.second, 2)
		buffer.writeUInt8(this.properties.frame, 3)

		// Not sure what the meaning of these 4 bytes is, but 0x00000000 works.
		buffer.writeUInt32BE(0x00000000, 4)

		return buffer
	}

	deserialize (rawCommand: Buffer) {
		this.properties = {
			hour: rawCommand.readUInt8(0),
			minute: rawCommand.readUInt8(1),
			second: rawCommand.readUInt8(2),
			frame: rawCommand.readUInt8(3)
		}
	}

	applyToState (state: AtemState) {
		state.info.lastTime = {
			...this.properties
		}
		return 'info.time'
	}
}

export class TimeRequestCommand extends AbstractCommand {
	rawName = 'TiRq'
	minimumVersion = Enums.ProtocolVersion.V8_0

	properties = {}

	serialize () {
		const buffer = Buffer.alloc(0)
		return buffer
	}
}
