import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { MultiViewerSourceState } from '../../state/settings'

export class MultiViewerSourceCommand extends AbstractCommand {
	rawName = 'CMvI'
	multiViewerId: number
	index: number

	properties: MultiViewerSourceState

	updateProps (newProps: Partial<MultiViewerSourceState>) {
		this._updateProps(newProps)
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.multiViewerId, 0)
		buffer.writeUInt8(this.properties.windowIndex, 1)
		buffer.writeUInt16BE(this.properties.source, 2)
		return buffer
	}
}

export class MultiViewerSourceUpdateCommand extends AbstractCommand {
	rawName = 'MvIn'
	multiViewerId: number
	index: number

	properties: MultiViewerSourceState

	deserialize (rawCommand: Buffer) {
		this.index = rawCommand.readUInt8(1)
		this.multiViewerId = rawCommand.readUInt8(0)

		this.properties = {
			source: rawCommand.readUInt16BE(2),
			windowIndex: rawCommand.readUInt8(1)
		}
	}

	applyToState (state: AtemState) {
		const multiviewer = state.settings.getMultiViewer(this.multiViewerId)
		multiviewer.windows[this.index] = {
			...multiviewer.windows[this.index],
			...this.properties
		}

		return `settings.multiViewers.${this.multiViewerId}.windows.${this.index}`
	}
}
