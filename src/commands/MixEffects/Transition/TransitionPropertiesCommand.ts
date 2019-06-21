import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { TransitionProperties } from '../../../state/video'
import { Util, Enums } from '../../..'

export class TransitionPropertiesCommand extends AbstractCommand {
	static MaskFlags = {
		style: 1 << 0,
		selection: 1 << 1
	}

	rawName = 'CTTp'
	mixEffect: number

	properties: TransitionProperties

	updateProps (newProps: Partial<TransitionProperties>) {
		this._updateProps(newProps)
	}

	serialize () {
		const buffer = Buffer.alloc(8, 0)
		Buffer.from(this.rawName).copy(buffer, 0)

		buffer.writeUInt8(this.flag, 4)

		buffer.writeUInt8(this.mixEffect, 5)
		buffer.writeUInt8(this.properties.style, 6)
		buffer.writeUInt8(this.properties.selection, 7)

		return buffer
	}
}

export class TransitionPropertiesUpdateCommand extends AbstractCommand {
	rawName = 'TrSS'
	mixEffect: number

	properties: TransitionProperties

	deserialize (rawCommand: Buffer) {
		this.mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		this.properties = {
			style: Util.parseEnum<Enums.TransitionStyle>(rawCommand[1], Enums.TransitionStyle),// rawCommand[1],
			selection: rawCommand[2],
			nextStyle: Util.parseEnum<Enums.TransitionStyle>(rawCommand[3], Enums.TransitionStyle),
			nextSelection: rawCommand[4]
		}
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		mixEffect.transitionProperties = {
			...this.properties
		}
	}
}
