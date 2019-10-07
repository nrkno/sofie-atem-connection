import { AtemState } from '../../state'
import { MediaPlayerSource } from '../../state/media'
import AbstractCommand from '../AbstractCommand'

export class MediaPlayerSourceCommand extends AbstractCommand {
	static MaskFlags = {
		sourceType: 1 << 0,
		stillIndex: 1 << 1,
		clipIndex: 1 << 2
	}

	static readonly rawName = 'MPSS'

	readonly mediaPlayerId: number
	properties: Partial<MediaPlayerSource>

	constructor (mediaPlayerId: number) {
		super()

		this.mediaPlayerId = mediaPlayerId
		this.properties = {}
	}

	updateProps (newProps: Partial<MediaPlayerSource>) {
		this._updateProps(newProps)
	}

	serialize () {
		const buffer = Buffer.alloc(8)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.mediaPlayerId, 1)
		buffer.writeUInt8(this.properties.sourceType || 0, 2)
		buffer.writeUInt8(this.properties.stillIndex || 0, 3)
		buffer.writeUInt8(this.properties.clipIndex || 0, 4)
		return buffer
	}
}

export class MediaPlayerSourceUpdateCommand extends AbstractCommand {
	static readonly rawName = 'MPCE'

	readonly mediaPlayerId: number
	readonly properties: Readonly<MediaPlayerSource>

	constructor (mediaPlayerId: number, properties: MediaPlayerSource) {
		super()

		this.mediaPlayerId = mediaPlayerId
		this.properties = properties
	}

	static deserialize (rawCommand: Buffer) {
		const mediaPlayerId = rawCommand[0]
		const properties = {
			sourceType: rawCommand[1],
			clipIndex: rawCommand[2],
			stillIndex: rawCommand[3]
		}

		return new MediaPlayerSourceUpdateCommand(mediaPlayerId, properties)
	}

	applyToState (state: AtemState) {
		state.media.players[this.mediaPlayerId] = {
			...state.media.players[this.mediaPlayerId],
			...this.properties
		}
		return `media.players.${this.mediaPlayerId}`
	}
}
