import { WritableCommand } from '../CommandBase'
import { BigInteger } from 'big-integer'
import * as Util from '../../lib/atemUtil'

export class FairlightMixerSourceEqualizerResetCommand extends WritableCommand<{ equalizer: boolean; band: number }> {
	public static MaskFlags = {
		equalizer: 1 << 0,
		band: 1 << 1
	}

	public static readonly rawName = 'RICE'

	public readonly index: number
	public readonly source: BigInteger

	constructor(index: number, source: BigInteger) {
		super()

		this.index = index
		this.source = source
	}

	public serialize(): Buffer {
		const buffer = Buffer.alloc(20)
		buffer.writeUInt8(this.flag, 0)
		buffer.writeUInt16BE(this.index, 2)
		Util.bigIntToBuf(buffer, this.source, 8)

		buffer.writeUInt8(this.properties.equalizer ? 1 : 0, 16)
		buffer.writeUInt8(this.properties.band || 0, 17)

		return buffer
	}
}
