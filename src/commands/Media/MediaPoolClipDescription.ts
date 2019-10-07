import { AtemState } from '../../state'
import { ClipBank } from '../../state/media'
import AbstractCommand from '../AbstractCommand'
import { Util } from '../../lib/atemUtil'

export class MediaPoolClipDescriptionCommand extends AbstractCommand {
	static readonly rawName = 'MPCS'

	readonly mediaPool: number
	readonly properties: Readonly<ClipBank>

	constructor (mediaPool: number, properties: ClipBank) {
		super()

		this.mediaPool = mediaPool
		this.properties = properties
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
