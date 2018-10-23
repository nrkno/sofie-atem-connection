import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { Enums } from '../..'

export class VideoModeCommand extends AbstractCommand {
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

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer[0] = this.properties.mode

		return Buffer.concat([Buffer.from('CVdM', 'ascii'), buffer])
	}

	applyToState (state: AtemState) {
		state.settings.videoMode = this.properties.mode
	}
}
