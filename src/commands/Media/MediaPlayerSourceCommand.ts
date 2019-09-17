import { AtemState } from '../../state'
import { MediaPlayerSource } from '../../state/media'
import AbstractCommand from '../AbstractCommand'

export class MediaPlayerSourceCommand extends AbstractCommand {
	static MaskFlags = {
		sourceType: 1 << 0,
		stillIndex: 1 << 1,
		clipIndex: 1 << 2
	}

	rawName = 'MPSS'
	mediaPlayerId: number

	properties: MediaPlayerSource

	updateProps (newProps: Partial<MediaPlayerSource>) {
		this._updateProps(newProps)
	}

	serialize () {
		const buffer = Buffer.alloc(8)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt8(this.mediaPlayerId, 1)
		buffer.writeUInt8(this.properties.sourceType, 2)
		buffer.writeUInt8(this.properties.clipIndex, 3)
		buffer.writeUInt8(this.properties.stillIndex, 4)
		return buffer
	}
}

export class MediaPlayerSourceUpdateCommand extends AbstractCommand {
	rawName = 'MPCE'
	mediaPlayerId: number

	properties: MediaPlayerSource

	deserialize (rawCommand: Buffer) {
		this.mediaPlayerId = rawCommand[0]
		this.properties = {
			sourceType: rawCommand[1],
			clipIndex: rawCommand[2],
			stillIndex: rawCommand[3]
		}
	}

	applyToState (state: AtemState) {
		state.media.players[this.mediaPlayerId] = {
			...state.media.players[this.mediaPlayerId],
			...this.properties
		}
		return `media.players.${this.mediaPlayerId}`
	}
}
