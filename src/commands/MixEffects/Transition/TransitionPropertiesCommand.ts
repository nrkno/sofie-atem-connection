import IAbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { TransitionStyle } from '../../../enums'

export class TransitionPropertiesCommand implements IAbstractCommand {
	resolve: () => void
	reject: () => void

	rawName = 'TrSS'
	packetId: number

	mixEffect: number
	flags: number
	style: TransitionStyle
	selection: number // @todo: document selection types: 1 is BG, 2 = KEY1, 3 = BG+KEY1, 4 = KEY2, 5 = BG+KEY2
	nextStyle: TransitionStyle
	nextSelection: number

	MaskFlags = {
		style: 1 << 0,
		selection: 1 << 1
	}

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
		this.style = rawCommand[1]
		this.selection = rawCommand[2]
		this.nextStyle = rawCommand[3]
		this.nextSelection = rawCommand[4]
	}

	serialize () {
		let rawCommand = 'CTTp'
		let buffer = new Buffer(8)
		buffer.fill(0)
		Buffer.from(rawCommand).copy(buffer, 0)

		buffer.writeUInt8(this.flags, 4)

		buffer.writeUInt8(this.mixEffect, 5)
		buffer.writeUInt8(this.style, 6)
		buffer.writeUInt8(this.selection, 7)

		return buffer
	}

	getAttributes () {
		return {
			mixEffect: this.mixEffect,
			style: this.style,
			selection: this.selection,
			nextStyle: this.nextStyle,
			nextSelection: this.nextSelection
		}
	}

	applyToState (state: AtemState) {
		let mixEffect = state.video.getMe(this.mixEffect)
		let props = this.getAttributes()
		delete props.mixEffect
		mixEffect.transitionProperties = props
	}
}
