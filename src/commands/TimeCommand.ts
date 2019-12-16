import AbstractCommand from './AbstractCommand'
import { AtemState } from '../state'
import { TimeInfo } from '../state/info'
import * as Enums from '../enums'

export class TimeCommand extends AbstractCommand {
	rawName = 'Time'

	properties: TimeInfo = {
		hours: 0,
		minutes: 0,
		seconds: 0,
		frames: 0
	}

	serialize () {
		const buffer = Buffer.alloc(8)
		buffer.writeUInt8(this.properties.hours, 0)
		buffer.writeUInt8(this.properties.minutes, 1)
		buffer.writeUInt8(this.properties.seconds, 2)
		buffer.writeUInt8(this.properties.frames, 3)

		// Not sure what the meaning of these 4 bytes is, but 0x00000000 works.
		buffer.writeUInt32BE(0x00000000, 4)

		return buffer
	}

	deserialize (rawCommand: Buffer) {
		this.properties = {
			hours: rawCommand.readUInt8(0),
			minutes: rawCommand.readUInt8(1),
			seconds: rawCommand.readUInt8(2),
			frames: rawCommand.readUInt8(3)
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
