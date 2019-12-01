import { AtemState } from '../../state'
import { ClipBank } from '../../state/media'
import { DeserializedCommand } from '../CommandBase'
import { Util } from '../../lib/atemUtil'

export class MediaPoolClipDescriptionCommand extends DeserializedCommand<Omit<ClipBank, 'frames'>> {
	public static readonly rawName = 'MPCS'

	public readonly mediaPool: number

	constructor (mediaPool: number, properties: Omit<ClipBank, 'frames'>) {
		super(properties)

		this.mediaPool = mediaPool
	}

	public static deserialize (rawCommand: Buffer) {
		const mediaPool = rawCommand[0]
		const properties = {
			isUsed: rawCommand[1] === 1,
			name: Util.bufToNullTerminatedString(rawCommand, 2, 64),
			frameCount: rawCommand.readUInt16BE(66)
		}

		return new MediaPoolClipDescriptionCommand(mediaPool, properties)
	}

	public applyToState (state: AtemState) {
		state.media.clipPool[this.mediaPool] = {
			...this.properties,
			frames: state.media.getClip(this.mediaPool).frames // TODO - lengthen/shorten array of frames?
		}
		return `media.clipPool.${this.mediaPool}`
	}
}
