import AbstractCommand from '../AbstractCommand'

export class LockObtainedCommand extends AbstractCommand {
	static readonly rawName = 'LKOB'

	readonly properties: Readonly<{
		index: number
	}>

	constructor (properties: LockObtainedCommand['properties']) {
		super()

		this.properties = properties
	}

	static deserialize (rawCommand: Buffer) {
		const properties = {
			index: rawCommand.readUInt16BE(0)
		}

		return new LockObtainedCommand(properties)
	}
}
