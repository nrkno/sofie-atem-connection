import { BasicWritableCommand } from '../CommandBase'

export class MediaPoolCaptureStillCommand extends BasicWritableCommand<Record<string, never>> {
	public static readonly rawName = 'Capt'

	constructor() {
		super({})
	}

	public serialize(): Buffer {
		return Buffer.alloc(0)
	}
}
