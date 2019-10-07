import { BasicWritableCommand, DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { Enums } from '../..'

export interface VideoModeProps {
	mode: Enums.VideoMode
}

export class VideoModeCommand extends BasicWritableCommand<VideoModeProps> {
	static readonly rawName = 'CVdM'

	constructor (mode: Enums.VideoMode) {
		super({ mode })
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.properties.mode, 0)
		return buffer
	}
}

export class VideoModeUpdateCommand extends DeserializedCommand<VideoModeProps> {
	static readonly rawName = 'VidM'

	constructor (mode: Enums.VideoMode) {
		super({ mode })
	}

	static deserialize (rawCommand: Buffer): VideoModeUpdateCommand {
		return new VideoModeUpdateCommand(rawCommand[0])
	}

	applyToState (state: AtemState) {
		state.settings.videoMode = this.properties.mode
		return `settings.videoMode`
	}
}
