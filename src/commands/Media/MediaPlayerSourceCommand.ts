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
		return new Buffer([
			...Buffer.from(this.rawName),
			this.flag,
			this.mediaPlayerId,
			this.properties.sourceType,
			this.properties.stillIndex,
			this.properties.clipIndex,
			0x00,
			0x00,
			0x00
		])
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
			stillIndex: rawCommand[2],
			clipIndex: rawCommand[3]
		}
	}

	applyToState (state: AtemState) {
		state.media.players[this.mediaPlayerId] = {
			...state.media.players[this.mediaPlayerId],
			...this.properties
		}
	}
}
