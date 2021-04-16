import { BasicWritableCommand } from '../CommandBase'

export class FairlightMixerResetPeakLevelsCommand extends BasicWritableCommand<{ all: boolean; master: boolean }> {
	public static readonly rawName = 'RFLP'

	public serialize(): Buffer {
		const buffer = Buffer.alloc(4)

		let val = 0
		if (this.properties.all) {
			val |= 1 << 0
		}
		if (this.properties.master) {
			val |= 1 << 1
		}

		buffer.writeUInt8(val, 0)
		return buffer
	}
}
