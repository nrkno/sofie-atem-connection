import { AtemState } from '../../state'
import { ClipBank } from '../../state/media'
import AbstractCommand from '../AbstractCommand'
import { Util } from '../../lib/atemUtil'

export class MediaPoolClipDescriptionCommand extends AbstractCommand {
	rawName = 'MPCS'

	mediaPool: number
	properties: ClipBank

	deserialize (rawCommand: Buffer) {
		this.mediaPool = rawCommand[0]
		this.properties = {
			isUsed: rawCommand[1] === 1,
			name: Util.bufToNullTerminatedString(rawCommand, 2, 64),
			frameCount: rawCommand.readUInt16BE(66),
			frames: []
		}
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
