import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { MediaPoolInfo } from '../../state/info'

export class MediaPoolConfigCommand extends DeserializedCommand<MediaPoolInfo> {
	public static readonly rawName = '_mpl'

	constructor (properties: MediaPoolInfo) {
		super(properties)
	}

	public static deserialize (rawCommand: Buffer): MediaPoolConfigCommand {
		return new MediaPoolConfigCommand({
			stillCount: rawCommand.readUInt8(0),
			clipCount: rawCommand.readUInt8(1)
		})
	}

	public applyToState (state: AtemState) {
		state.info.mediaPool = this.properties
		return `info.mediaPool`
	}
}
