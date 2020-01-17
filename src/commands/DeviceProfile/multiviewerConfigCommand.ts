import { DeserializedCommand } from '../CommandBase'
import { AtemState } from '../../state'
import { MultiviewerInfo } from '../../state/info'

export class MultiviewerConfigCommand extends DeserializedCommand<MultiviewerInfo> {
	public static readonly rawName = '_MvC'

	constructor (properties: MultiviewerInfo) {
		super(properties)
	}

	public static deserialize (rawCommand: Buffer): MultiviewerConfigCommand {
		return new MultiviewerConfigCommand({
			count: rawCommand.readUInt8(0),
			windowCount: rawCommand.readUInt8(1)
			// Note: there are a bunch more properties, but their use is not confirmed and has changed over time,
			// also we dont care about them for now
		})
	}

	public applyToState (state: AtemState) {
		state.info.multiviewer = this.properties
		return `info.multiviewer`
	}
}
