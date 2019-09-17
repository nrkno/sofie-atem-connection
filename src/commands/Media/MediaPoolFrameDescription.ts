import { AtemState } from '../../state'
import { StillFrame } from '../../state/media'
import AbstractCommand from '../AbstractCommand'
import { Util } from '../../lib/atemUtil'

export class MediaPoolFrameDescriptionCommand extends AbstractCommand {
	rawName = 'MPfe'

	mediaPool: number
	frameIndex: number
	properties: StillFrame

	deserialize (rawCommand: Buffer) {
		this.mediaPool = rawCommand[0]
		this.frameIndex = rawCommand.readUInt16BE(2)
		this.properties = {
			isUsed: rawCommand[4] === 1,
			hash: Util.bufToBase64String(rawCommand, 5, 16),
			fileName: Util.bufToNullTerminatedString(rawCommand, 24, rawCommand[23])
		}
	}

	applyToState (state: AtemState) {
		if (this.mediaPool === 0) {
			state.media.stillPool[this.frameIndex] = this.properties
			return `media.stillPool.${this.frameIndex}`
		} else if (this.mediaPool < 3) {
			state.media.clipPool[this.mediaPool - 1].frames[this.frameIndex] = this.properties
			return `media.clipPool.${this.mediaPool - 1}.${this.frameIndex}`
		}
		return `media`
	}
}
