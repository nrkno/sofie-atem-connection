import { BasicWritableCommand } from '../CommandBase'
import { Enums } from '../..'

export interface DataTransferUploadRequestProps {
	transferId: number
	transferStoreId: number
	transferIndex: number
	size: number
	mode: Enums.TransferMode
}

export class DataTransferUploadRequestCommand extends BasicWritableCommand<DataTransferUploadRequestProps> {
	public static readonly rawName = 'FTSD'

	public serialize () {
		const buffer = Buffer.alloc(16)
		buffer.writeUInt16BE(this.properties.transferId, 0)
		buffer.writeUInt16BE(this.properties.transferStoreId, 2)
		buffer.writeUInt16BE(this.properties.transferIndex, 6)
		buffer.writeUInt32BE(this.properties.size, 8)
		buffer.writeUInt16BE(this.properties.mode, 12) // @todo: should this be split into 2x enum8?
		return buffer
	}
}
