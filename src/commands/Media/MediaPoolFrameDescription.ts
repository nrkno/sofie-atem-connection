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
		const mediaPool = rawCommand.readUInt8(0)
		const frameIndex = rawCommand.readUInt16BE(2)
		const properties = {
			isUsed: rawCommand.readUInt8(4) === 1,
			hash: Util.bufToBase64String(rawCommand, 5, 16),
			fileName: Util.bufToNullTerminatedString(rawCommand, 24, rawCommand.readUInt8(23))
		}

		return new MediaPoolFrameDescriptionCommand(mediaPool, frameIndex, properties)
	}

	public applyToState (state: AtemState): string | string[] {
		// TODO - validate ids

		if (this.mediaPool === 0) {
			// This is a still
			state.media.stillPool[this.frameIndex] = this.properties
			return `media.stillPool.${this.frameIndex}`
		} else if (this.mediaPool < 3) {
			const clipId = this.mediaPool - 1
			// This is a clip
			state.media.getClip(clipId).frames[this.frameIndex] = this.properties
			return `media.clipPool.${clipId}.frames.${this.frameIndex}`
		}
		return []
	}
}
