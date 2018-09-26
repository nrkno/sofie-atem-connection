import AbstractCommand from '../AbstractCommand'

export class DataTransferFileDescriptionCommand extends AbstractCommand {
	rawName = ''

	properties: {
		transferId: number,
		name: string,
		description: string,
		fileHash: string
	}

	serialize () {
		const buffer = Buffer.alloc(212)
		buffer.writeUInt16BE(this.properties.transferId, 0)
		if (this.properties.name) buffer.write(this.properties.name, 2, 64)
		if (this.properties.description) buffer.write(this.properties.description, 66, 128)
		buffer.write(this.properties.fileHash, 194, 16)

		return Buffer.concat([Buffer.from('FTFD', 'ascii'), buffer])
	}
}
