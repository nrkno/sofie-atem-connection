import { AtemState } from '../../state'
import { ClipBank } from '../../state/media'
import { DeserializedCommand } from '../CommandBase'
import { Util } from '../../lib/atemUtil'

export class MediaPoolClipDescriptionCommand extends DeserializedCommand<ClipBank> {
	static readonly rawName = 'MPCS'

	readonly mediaPool: number

	constructor (mediaPool: number, properties: ClipBank) {
		super(properties)

		this.mediaPool = mediaPool
	}

	static deserialize (rawCommand: Buffer) {
		const mediaPool = rawCommand[0]
		const properties = {
			isUsed: rawCommand[1] === 1,
			name: Util.bufToNullTerminatedString(rawCommand, 2, 64),
			frameCount: rawCommand.readUInt16BE(66),
			frames: []
		}

		return new MediaPoolClipDescriptionCommand(mediaPool, properties)
	}

	applyToState (state: AtemState) {
		const newProps = { ...this.properties }
		if (state.media.clipPool[this.mediaPool]) {
			newProps.frames = state.media.clipPool[this.mediaPool].frames
		}
		state.media.clipPool[this.mediaPool] = newProps
		return `media.clipPool.${this.mediaPool}`
	}
}
