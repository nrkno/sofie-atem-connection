import AbstractCommand from '../AbstractCommand'

export class DataTransferDataCommand extends AbstractCommand {
	rawName = 'FTDa'

	properties: {
		transferId: number,
		body: Buffer
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt16BE(this.properties.transferId, 0)
		buffer.writeUInt16BE(this.properties.body.length, 2)

		return Buffer.concat([Buffer.from('FTDa', 'ascii'), buffer, this.properties.body])
	}

	deserialize (rawCommand: Buffer) {
		this.properties = {
			transferId: rawCommand.readUInt16BE(0),
			body: rawCommand.slice(4, 4 + rawCommand.readUInt16BE(2))
		}
	}
}
