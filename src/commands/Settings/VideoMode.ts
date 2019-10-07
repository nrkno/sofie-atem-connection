import AbstractCommand, { BasicWritableCommand } from '../AbstractCommand'
import { AtemState } from '../../state'
import { Enums } from '../..'

export interface VideoModeProps {
	mode: Enums.VideoMode
}

export class VideoModeCommand extends BasicWritableCommand<VideoModeProps> {
	static readonly rawName = 'CVdM'

	constructor (mode: Enums.VideoMode) {
		super()

		this.properties = {
			mode
		}
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.properties.mode, 0)
		return buffer
	}
}

export class VideoModeUpdateCommand extends AbstractCommand {
	static readonly rawName = 'VidM'

	readonly properties: Readonly<VideoModeProps>

	constructor (mode: Enums.VideoMode) {
		super()

		this.properties = {
			mode
		}
	}

	static deserialize (rawCommand: Buffer): VideoModeUpdateCommand {
		return new VideoModeUpdateCommand(rawCommand[0])
	}

	applyToState (state: AtemState) {
		state.settings.videoMode = this.properties.mode
		return `settings.videoMode`
	}
}
