import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { SupportedVideoMode } from '../../state/info'
import { VideoMode } from '../../enums'

export class VideoMixerConfigCommand extends DeserializedCommand<Array<SupportedVideoMode>> {
	public static readonly rawName = '_VMC'

	constructor(properties: Array<SupportedVideoMode>) {
		super(properties)
	}

	public static deserialize(rawCommand: Buffer): VideoMixerConfigCommand {
		const modes: Array<SupportedVideoMode> = []

		const count = rawCommand.readUInt16BE(0)
		for (let i = 0; i < count; i++) {
			const baseOffset = 4 + i * 13

			modes.push({
				mode: rawCommand.readUInt8(baseOffset),
				multiviewerModes: readVideoModeBitmask(rawCommand.readUInt32BE(baseOffset + 4)),
				downConvertModes: readVideoModeBitmask(rawCommand.readUInt32BE(baseOffset + 8)),
				requiresReconfig: rawCommand.readUInt8(baseOffset + 12) !== 0,
			})
		}

		return new VideoMixerConfigCommand(modes)
	}

	public applyToState(state: AtemState): string | string[] {
		state.info.supportedVideoModes = this.properties
		return `info.supportedVideoModes`
	}
}

function readVideoModeBitmask(rawVal: number): Array<VideoMode> {
	const modes: Array<VideoMode> = []
	for (const possibleMode of Object.values(VideoMode)) {
		if (typeof possibleMode === 'number' && (rawVal & (1 << possibleMode)) != 0) modes.push(possibleMode)
	}

	return modes
}
