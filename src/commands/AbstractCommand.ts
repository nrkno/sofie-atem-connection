import { AtemState } from '../lib/atemState'

export interface IAbstractCommand {
	rawName: string
	packetId: number
	resolve: (cmd: AbstractCommand) => void
	reject: (cmd: AbstractCommand) => void

	deserialize: (rawCommand: Buffer) => void
	serialize: () => Buffer
	getAttributes: () => any
	applyToState: (state: AtemState) => void
}

export default class AbstractCommand implements IAbstractCommand {
	rawName: string
	packetId: number
	resolve: (cmd: AbstractCommand) => void
	reject: (cmd: AbstractCommand) => void

	deserialize: (rawCommand: Buffer) => void
	serialize: () => Buffer
	getAttributes: () => any
	applyToState: (state: AtemState) => void
}
