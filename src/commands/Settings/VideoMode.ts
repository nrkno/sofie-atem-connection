import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { Enums } from '../..'

export class VideoModeCommand extends AbstractCommand {
	rawName = 'CVdM'
	auxBus: number

	properties: {
		mode: Enums.VideoMode
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.properties.mode, 0)
		return buffer
	}
}

export class VideoModeUpdateCommand extends AbstractCommand {
	rawName = 'VidM'
	auxBus: number

	properties: {
		mode: Enums.VideoMode
	}

	deserialize (rawCommand: Buffer) {
		this.properties = {
			mode: rawCommand[0]
		}
	}

	applyToState (state: AtemState) {
		state.settings.videoMode = this.properties.mode
		return `settings.videoMode`
	}
}
