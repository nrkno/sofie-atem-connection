import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { MultiViewerSourceState } from '../../state/settings'

export class MultiViewerSourceCommand extends AbstractCommand {
	rawName = 'MvIn'
	multiViewerId: number
	index: number

	properties: MultiViewerSourceState

	updateProps (newProps: Partial<MultiViewerSourceState>) {
		this._updateProps(newProps)
	}

	deserialize (rawCommand: Buffer) {
		this.index = rawCommand.readUInt8(1)
		this.multiViewerId = rawCommand.readUInt8(0)

		this.properties = {
			source: rawCommand.readUInt16BE(2),
			windowIndex: rawCommand.readUInt8(1)
		}
	}

	serialize () {
		const rawCommand = 'CMvI'
		return new Buffer([
			...Buffer.from(rawCommand),
			this.multiViewerId,
			this.properties.windowIndex,
			this.properties.source >> 8,
			this.properties.source & 0xFF
		])
	}

	applyToState (state: AtemState) {
		const obj: { [key: string]: MultiViewerSourceState } = {}
		obj[this.index] = this.properties

		state.settings.multiViewers[this.multiViewerId] = {
			...state.settings.multiViewers[this.multiViewerId],
			...obj
		}
	}
}
