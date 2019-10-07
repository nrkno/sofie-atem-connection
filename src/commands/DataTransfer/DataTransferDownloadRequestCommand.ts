import AbstractCommand from '../AbstractCommand'

export class DataTransferDownloadRequestCommand extends AbstractCommand {
	static readonly rawName = 'FTSU'

	properties: {
		transferId: number,
		transferStoreId: number,
		transferIndex: number
	}

	serialize () {
		const buffer = Buffer.alloc(12)
		buffer.writeUInt16BE(this.properties.transferId, 0)
		buffer.writeUInt16BE(this.properties.transferStoreId, 2)
		buffer.writeUInt8(this.properties.transferIndex, 7)

		buffer.writeUInt16BE(0x00f9, 8)
		buffer.writeUInt16BE(0x020f, 10)

		return buffer
	}
}
