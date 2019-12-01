import { AtemState } from '../../state'
import { StillFrame } from '../../state/media'
import { DeserializedCommand } from '../CommandBase'
import { Util } from '../../lib/atemUtil'

export class MediaPoolFrameDescriptionCommand extends DeserializedCommand<StillFrame> {
	public static readonly rawName = 'MPfe'

	public readonly mediaPool: number
	public readonly frameIndex: number

	constructor (mediaPool: number, frameIndex: number, properties: StillFrame) {
		super(properties)

		this.mediaPool = mediaPool
		this.frameIndex = frameIndex
	}

	public static deserialize (rawCommand: Buffer) {
		const mediaPool = rawCommand[0]
		const frameIndex = rawCommand.readUInt16BE(2)
		const properties = {
			isUsed: rawCommand[4] === 1,
			hash: Util.bufToBase64String(rawCommand, 5, 16),
			fileName: Util.bufToNullTerminatedString(rawCommand, 24, rawCommand[23])
		}

		return new MediaPoolFrameDescriptionCommand(mediaPool, frameIndex, properties)
	}

	public applyToState (state: AtemState) {
		if (this.mediaPool === 0) {
			// This is a still
			state.media.stillPool[this.frameIndex] = this.properties
			return `media.stillPool.${this.frameIndex}`
		} else if (this.mediaPool < 3) {
			// This is a clip
			state.media.getClip(this.mediaPool - 1).frames[this.frameIndex] = this.properties
			return `media.clipPool.${this.mediaPool - 1}.${this.frameIndex}`
		}
		return `media`
	}
}
