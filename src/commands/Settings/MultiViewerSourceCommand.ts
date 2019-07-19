import AbstractCommand from '../AbstractCommand'
import { AtemState } from '../../state'
import { MultiViewerSourceState } from '../../state/settings'
import { ProtocolVersion } from '../../enums'

export class MultiViewerSourceV8Command extends AbstractCommand {
	rawName = 'CMvI'
	multiViewerId: number
	index: number
	minimumVersion = ProtocolVersion.V8_0

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

export class MultiViewerSourceV8UpdateCommand extends AbstractCommand {
	rawName = 'MvIn'
	multiViewerId: number
	index: number
	minimumVersion = ProtocolVersion.V8_0

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
		const obj: { [key: string]: MultiViewerSourceState } = {}
		obj[this.index] = this.properties

		state.settings.getMultiViewer(this.multiViewerId).windows[this.index] = {
			...state.settings.getMultiViewer(this.multiViewerId).windows[this.index],
			...obj
		}
	}
}

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
		const obj: { [key: string]: MultiViewerSourceState } = {}
		obj[this.index] = this.properties

		state.settings.getMultiViewer(this.multiViewerId).windows[this.index] = {
			...state.settings.getMultiViewer(this.multiViewerId).windows[this.index],
			...obj
		}
	}
}
