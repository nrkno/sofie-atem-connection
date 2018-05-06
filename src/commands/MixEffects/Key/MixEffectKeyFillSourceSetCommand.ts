import AbstractCommand from '../../AbstractCommand'

export class MixEffectKeyFillSourceSetCommand extends AbstractCommand {
	rawName = 'CKeF'
	mixEffect: number
	upstreamKeyerId: number
	properties: {
		fillSource: number
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.mixEffect, 0)
		buffer.writeUInt8(this.upstreamKeyerId, 1)
		buffer.writeUInt16BE(this.properties.fillSource, 2)
		return Buffer.concat([Buffer.from('CKeF', 'ascii'), buffer])
	}
}
