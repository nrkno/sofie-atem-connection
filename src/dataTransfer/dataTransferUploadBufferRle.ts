import * as Util from '../lib/atemUtil'
import { DataTransferUploadBuffer } from './dataTransferUploadBuffer'

export abstract class DataTransferUploadBufferRle extends DataTransferUploadBuffer {
	protected encodeData(data: Buffer): Buffer {
		return Util.encodeRLE(data)
	}
}
