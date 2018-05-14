import AbstractCommand from '../AbstractCommand'

export class LockStateCommand extends AbstractCommand {
	rawName = 'LKST'

	properties: {
		index: number,
		locked: boolean
	}

	deserialize (rawCommand: Buffer) {
		this.properties = {
			index: rawCommand.readUInt16BE(0),
			locked: rawCommand[2] === 1
		}
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt16BE(this.properties.index, 0)
		buffer[2] = this.properties.locked ? 1 : 0

		return Buffer.concat([Buffer.from('LOCK', 'ascii'), buffer])
	}
}
