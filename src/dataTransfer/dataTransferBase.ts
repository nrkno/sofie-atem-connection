import { Enums } from '../'
import * as Commands from '../commands'

export enum TransferState {
	Queued,
	LockRequested,
	Locked,
	UploadRequested,
	Transferring,
	Finished
}

export abstract class DataTransfer {
	readonly index: number

	transferring = false
	lastSent: number
	pool: number
	description: {
		name: string,
		description: string
	}
	data: Buffer
	type: Enums.StoragePool
	state: TransferState
	finish: () => void
	fail: () => void

	protected _hash: string
	protected _queueCommand: (command: Commands.AbstractCommand) => void
	protected _sendCommand: (command: Commands.AbstractCommand) => Promise<Commands.AbstractCommand>
	protected _sent = 0
	protected _sentDesc = false

	constructor (
		index: number,
		pool: number,
		type: Enums.StoragePool,
		description: {
			name: string,
			description: string
		},
		queueCommand: (command: Commands.AbstractCommand) => void,
		sendCommand: (command: Commands.AbstractCommand) => Promise<Commands.AbstractCommand>
	) {
		this.index = index
		this.pool = pool
		this.type = type
		this.description = description
		this._hash = Math.random().toString(36).substring(7) // @todo: create hash from data
		this._queueCommand = queueCommand
		this._sendCommand = sendCommand
	}

	start () {
		const command = new Commands.LockStateCommand()
		command.updateProps({
			index: this.type,
			locked: true
		})
		this._sendCommand(command)
		this.state = TransferState.LockRequested
	}

	abstract continueUpload (chunkCount: number, chunkSize: number): void

	abstract processAtemCommand (command: Commands.AbstractCommand): void
}
