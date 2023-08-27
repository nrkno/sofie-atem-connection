import * as Util from '../lib/atemUtil'
import { DataTransferUploadBuffer } from './dataTransferUploadBuffer'

export interface DataTransferUploadBufferRleOptions {
	disableRLE?: boolean
}

export abstract class DataTransferUploadBufferRle extends DataTransferUploadBuffer {
	#options: DataTransferUploadBufferRleOptions

	constructor(data: Buffer, options: DataTransferUploadBufferRleOptions) {
		super(data)

		this.#options = options
	}
	protected encodeData(data: Buffer): Buffer {
		if (this.#options.disableRLE) {
			return data
		} else {
			return Util.encodeRLE(data)
		}
	}
}
