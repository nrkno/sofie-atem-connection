import AbstractCommand from '../AbstractCommand'

export class DataTransferDataCommand extends AbstractCommand {
	rawName = 'FTDa'

	properties: {
		transferId: number,
		size: number,
		body: Buffer
	}

	serialize () {
		this.properties.size = this.properties.body.length
		const buffer = Buffer.alloc(4)
		buffer.writeUInt16BE(this.properties.transferId, 0)
		buffer.writeUInt16BE(this.properties.size, 2)

		return Buffer.concat([ buffer, this.properties.body ])
	}

	deserialize (rawCommand: Buffer) {
		this.properties = {
			transferId: rawCommand.readUInt16BE(0),
			size: rawCommand.readUInt16BE(2),
			body: rawCommand.slice(4, 4 + rawCommand.readUInt16BE(2))
		}
	}
}
