import AbstractCommand, { WritableCommand } from '../AbstractCommand'
import { AtemState } from '../../state'
import { MultiViewerSourceState } from '../../state/settings'

export class MultiViewerSourceCommand extends WritableCommand<MultiViewerSourceState> {
	static readonly rawName = 'CMvI'

	readonly multiViewerId: number

	constructor (multiviewerId: number) {
		super()

		this.multiViewerId = multiviewerId
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(this.multiViewerId, 0)
		buffer.writeUInt8(this.properties.windowIndex || 0, 1)
		buffer.writeUInt16BE(this.properties.source || 0, 2)
		return buffer
	}
}

export class MultiViewerSourceUpdateCommand extends AbstractCommand {
	static readonly rawName = 'MvIn'

	readonly multiViewerId: number
	readonly properties: Readonly<MultiViewerSourceState>

	constructor (multiviewerId: number, properties: MultiViewerSourceState) {
		super()

		this.multiViewerId = multiviewerId
		this.properties = properties
	}

	static deserialize (rawCommand: Buffer): MultiViewerSourceUpdateCommand {
		const multiViewerId = rawCommand.readUInt8(0)
		const properties = {
			source: rawCommand.readUInt16BE(2),
			windowIndex: rawCommand.readUInt8(1)
		}

		return new MultiViewerSourceUpdateCommand(multiViewerId, properties)
	}

	applyToState (state: AtemState) {
		const multiviewer = state.settings.getMultiViewer(this.multiViewerId)
		multiviewer.windows[this.properties.windowIndex] = {
			...multiviewer.windows[this.properties.windowIndex],
			...this.properties
		}

		return `settings.multiViewers.${this.multiViewerId}.windows.${this.properties.windowIndex}`
	}
}
