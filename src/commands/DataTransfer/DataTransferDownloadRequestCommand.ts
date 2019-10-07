import { BasicWritableCommand } from '../CommandBase'

export interface DataTransferDownloadRequestProps {
	transferId: number
	transferStoreId: number
	transferIndex: number
}

export class DataTransferDownloadRequestCommand extends BasicWritableCommand<DataTransferDownloadRequestProps> {
	static readonly rawName = 'FTSU'

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
