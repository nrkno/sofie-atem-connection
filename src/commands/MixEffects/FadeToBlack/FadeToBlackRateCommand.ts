import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { Util } from '../../..'

export class FadeToBlackRateCommand extends AbstractCommand {
	static readonly rawName = 'FtbC'

	readonly mixEffect: number
	readonly properties: Readonly<{
		rate: number
	}>

	constructor (mixEffect: number, rate: number) {
		super()

		this.mixEffect = mixEffect
		this.properties = { rate }
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(1, 0)
		buffer.writeUInt8(this.mixEffect, 1)
		buffer.writeUInt8(this.properties.rate, 2)
		return buffer
	}
}

export class FadeToBlackRateUpdateCommand extends AbstractCommand {
	static readonly rawName = 'FtbP'

	readonly mixEffect: number
	readonly properties: Readonly<{
		rate: number
	}>

	constructor (mixEffect: number, properties: FadeToBlackRateUpdateCommand['properties']) {
		super()

		this.mixEffect = mixEffect
		this.properties = properties
	}

	static deserialize (rawCommand: Buffer) {
		const mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		const properties = {
			rate: rawCommand.readUInt8(1)
		}

		return new FadeToBlackRateUpdateCommand(mixEffect, properties)
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.fadeToBlack = {
			...mixEffect.fadeToBlack,
			rate: this.properties.rate
		}
		return `video.ME.${this.mixEffect}.fadeToBlack`
	}
}
