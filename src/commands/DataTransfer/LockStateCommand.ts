import AbstractCommand from '../AbstractCommand'

export class LockStateCommand extends AbstractCommand {
	static readonly rawName = 'LOCK'

	readonly properties: Readonly<{
		index: number,
		locked: boolean
	}>

	constructor (index: number, locked: boolean) {
		super()

		this.properties = { index, locked }
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt16BE(this.properties.index, 0)
		buffer[2] = this.properties.locked ? 1 : 0
		return buffer
	}
}

export class LockStateUpdateCommand extends AbstractCommand {
	static readonly rawName = 'LKST'

	readonly properties: Readonly<{
		index: number,
		locked: boolean
	}>

	constructor (properties: LockStateUpdateCommand['properties']) {
		super()

		this.properties = properties
	}

	static deserialize (rawCommand: Buffer) {
		const properties = {
			index: rawCommand.readUInt16BE(0),
			locked: rawCommand[2] === 1
		}

		return new LockStateUpdateCommand(properties)
	}
}
