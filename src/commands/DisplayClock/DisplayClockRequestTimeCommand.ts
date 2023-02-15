import { BasicWritableCommand } from '../CommandBase'

export class DisplayClockRequestTimeCommand extends BasicWritableCommand<Record<string, unknown>> {
	public static readonly rawName = 'DSTR'

	constructor() {
		super({})
	}

	public serialize(): Buffer {
		// Future: id at byte 0
		return Buffer.alloc(4)
	}
}
