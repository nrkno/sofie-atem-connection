import * as Enums from '../enums'

export interface MediaPlayer {
	playing: boolean
	loop: boolean
	atBeginning: boolean
	clipFrame: number
}

export interface MediaPlayerSource {
	sourceType: Enums.MediaSourceType
	clipIndex: number
	stillIndex: number
}

export type MediaPlayerState = MediaPlayer & MediaPlayerSource

export class MediaState {
	stillPool: Array<StillFrame | undefined> = []
	clipPool: Array<ClipBank | undefined> = []
	players: Array<MediaPlayerState | undefined> = []

	getMediaPlayer (index: number, dontCreate?: boolean): MediaPlayerState {
		let player = this.players[index]
		if (!player) {
			player = {
				playing: false,
				loop: false,
				atBeginning: false,
				clipFrame: 0,
				sourceType: Enums.MediaSourceType.Clip,
				clipIndex: 0,
				stillIndex: 0
			}

			if (!dontCreate) {
				this.players[index] = player
			}
		}

		return player
	}

	getClip (index: number): ClipBank {
		const clip = this.clipPool[index]
		if (!clip) {
			return this.clipPool[index] = {
				isUsed: false,
				name: '',
				frameCount: 0,
				frames: []
			}
		}

		return clip
	}
}

export interface StillFrame {
	isUsed: boolean
	hash: string
	fileName: string
}

export interface ClipBank {
	isUsed: boolean
	name: string
	frameCount: number
	frames: Array<StillFrame | undefined>
}
