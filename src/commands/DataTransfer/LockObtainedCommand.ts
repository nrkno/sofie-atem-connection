import AbstractCommand from '../AbstractCommand'

export class LockObtainedCommand extends AbstractCommand {
	rawName = 'LKOB'

	properties: {
		index: number
	}

	deserialize (rawCommand: Buffer) {
		this.properties = {
			index: rawCommand.readUInt16BE(0)
		}
	}
}
