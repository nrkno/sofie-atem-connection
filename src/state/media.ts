export class MediaState {
	stillPool = {}
	clipPool = {}
	players: Array<{ playing: boolean, loop: boolean, atBeginning: boolean, clipFrame: number }> = []
}
