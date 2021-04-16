import { WritableCommand } from '../CommandBase'
import { FairlightDynamicsResetProps } from './common'
import { BigInteger } from 'big-integer'
import * as Util from '../../lib/atemUtil'

export class FairlightMixerSourceDynamicsResetCommand extends WritableCommand<FairlightDynamicsResetProps> {
	public static readonly rawName = 'RICD'

	public readonly index: number
	public readonly source: BigInteger

	constructor(index: number, source: BigInteger) {
		super()

		this.index = index
		this.source = source
	}

	public serialize(): Buffer {
		const buffer = Buffer.alloc(20)
		buffer.writeUInt16BE(this.index, 0)
		Util.bigIntToBuf(buffer, this.source, 8)

		let val = 0
		if (this.properties.dynamics) {
			val |= 1 << 0
		}
		if (this.properties.expander) {
			val |= 1 << 1
		}
		if (this.properties.compressor) {
			val |= 1 << 2
		}
		if (this.properties.limiter) {
			val |= 1 << 3
		}

		buffer.writeUInt8(val, 17)
		return buffer
	}
}
