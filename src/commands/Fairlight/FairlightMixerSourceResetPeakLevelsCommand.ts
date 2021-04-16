import { BasicWritableCommand } from '../CommandBase'
import { BigInteger } from 'big-integer'
import * as Util from '../../lib/atemUtil'

export class FairlightMixerSourceResetPeakLevelsCommand extends BasicWritableCommand<{
	output: boolean
	dynamicsInput: boolean
	dynamicsOutput: boolean
}> {
	public static readonly rawName = 'RFIP'

	public readonly index: number
	public readonly source: BigInteger

	constructor(
		index: number,
		source: BigInteger,
		properties: FairlightMixerSourceResetPeakLevelsCommand['properties']
	) {
		super(properties)

		this.index = index
		this.source = source
	}

	public serialize(): Buffer {
		const buffer = Buffer.alloc(20)
		buffer.writeUInt16BE(this.index, 0)
		Util.bigIntToBuf(buffer, this.source, 8)

		let val = 0
		if (this.properties.dynamicsInput) {
			val |= 1 << 0
		}
		if (this.properties.dynamicsOutput) {
			val |= 1 << 1
		}
		if (this.properties.output) {
			val |= 1 << 2
		}

		buffer.writeUInt8(val, 17)
		return buffer
	}
}
