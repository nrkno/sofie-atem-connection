export interface MediaPlayer {
	playing: boolean
	loop: boolean
	atBeginning: boolean
	clipFrame: number
}

export class MediaState {
	stillPool = {}
	clipPool = {}
	players: Array<MediaPlayer> = []
}
