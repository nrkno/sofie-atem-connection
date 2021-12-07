import exitHook = require('exit-hook')

import { Commands, Enums } from '..'
import DataLock, { DummyLock } from './dataLock'
import DataTransferFrame from './dataTransferFrame'
import DataTransferStill from './dataTransferStill'
import DataTransferClip from './dataTransferClip'
import DataTransferAudio from './dataTransferAudio'
import { ISerializableCommand } from '../commands/CommandBase'
import DataTransfer from './dataTransfer'
import PQueue from 'p-queue'
import DataTransferMultiViewerLabel from './dataTransferMultiViewerLabel'
import MacroLock from './MacroLock'
import { DataDownloadMacro, DataUploadMacro } from './dataTransferMacro'

const MAX_PACKETS_TO_SEND_PER_TICK = 10
const MAX_TRANSFER_INDEX = (1 << 16) - 1 // Inclusive maximum

export class DataTransferManager {
	private readonly commandQueue: Array<ISerializableCommand> = []

	private readonly stillsLock = new DataLock(0, (cmd) => this.commandQueue.push(cmd))
	public readonly labelsLock = new DummyLock((cmd) => this.commandQueue.push(cmd))
	private readonly clipLocks = [
		// TODO - this would be better to be dynamically sized based on the model we are connected to
		new DataLock(1, (cmd) => this.commandQueue.push(cmd)),
		new DataLock(2, (cmd) => this.commandQueue.push(cmd)),
		new DataLock(3, (cmd) => this.commandQueue.push(cmd)),
		new DataLock(4, (cmd) => this.commandQueue.push(cmd)),
	]
	private readonly macroLock = new MacroLock((cmd) => this.commandQueue.push(cmd))

	private interval?: NodeJS.Timer
	private exitUnsubscribe?: () => void

	private transferIndex = 0

	private pQueue = new PQueue({ concurrency: 1 })

	public startCommandSending(sendCommands: (cmds: ISerializableCommand[]) => Array<Promise<void>>): void {
		if (!this.interval) {
			// New connection means a new queue
			this.commandQueue.splice(0, this.commandQueue.length)

			this.interval = setInterval(() => {
				if (this.commandQueue.length <= 0) {
					return
				}

				const commandsToSend = this.commandQueue.splice(0, MAX_PACKETS_TO_SEND_PER_TICK)
				// The only way commands are rejected is if the connection dies, so if any reject then we fail
				Promise.all(sendCommands(commandsToSend)).catch((e) => {
					// TODO - handle this better. it should kill/restart the upload. and should also be logged in some way
					console.log(`Transfer send error: ${e}`)
				})
			}, 0)
		}
		if (!this.exitUnsubscribe) {
			this.exitUnsubscribe = exitHook(() => {
				this.stopCommandSending()
			})
		}
	}
	public stopCommandSending(): void {
		if (this.exitUnsubscribe) {
			this.exitUnsubscribe()
			this.exitUnsubscribe = undefined
		}
		if (this.interval) {
			clearInterval(this.interval)
			this.interval = undefined
		}
	}

	public queueCommand(command: Commands.IDeserializedCommand): void {
		this.pQueue
			.add(async () => {
				const allLocks = [this.stillsLock, ...this.clipLocks, this.labelsLock]

				// try to establish the associated DataLock:
				let lock: DataLock | MacroLock | DummyLock | undefined

				if (
					command.constructor.name === Commands.LockObtainedCommand.name ||
					command.constructor.name === Commands.LockStateUpdateCommand.name
				) {
					lock = allLocks[command.properties.index]
				} else if (typeof command.properties.storeId === 'number') {
					lock = allLocks[command.properties.storeId]
				} else if (
					command.properties.transferId !== undefined ||
					command.properties.transferIndex !== undefined
				) {
					for (const _lock of allLocks) {
						if (
							_lock.activeTransfer &&
							(_lock.activeTransfer.transferId === command.properties.transferId ||
								_lock.activeTransfer.transferId === command.properties.transferIndex)
						) {
							lock = _lock
						}
					}
				} else {
					// debugging:
					console.log('UNKNOWN COMMAND:', command)
					return
				}

				// console.log('CMD', command.constructor.name)
				if (!lock) return

				// handle actual command
				if (command.constructor.name === Commands.LockObtainedCommand.name && 'lockObtained' in lock) {
					await lock.lockObtained()
				}
				if (command.constructor.name === Commands.LockStateUpdateCommand.name && 'lockObtained' in lock) {
					const transferFinished =
						lock.activeTransfer && lock.activeTransfer.state === Enums.TransferState.Finished
					if (!command.properties.locked || transferFinished) {
						lock.lostLock()
					} else {
						lock.updateLock(command.properties.locked)
					}
				}
				if (command.constructor.name === Commands.DataTransferErrorCommand.name) {
					lock.transferErrored(command.properties.errorCode).catch((e) => {
						// TODO - handle this better. it should kill/restart the upload. and should also be logged in some way
						console.log(`Error when handling transfer error code ${command.properties.errorCode}: ${e}`)
					})
				}
				if (lock.activeTransfer) {
					const cmds = await lock.activeTransfer.handleCommand(command)
					cmds.forEach((cmd) => this.commandQueue.push(cmd))
					if (lock.activeTransfer.state === Enums.TransferState.Finished) {
						lock.transferFinished()
					}
				}
			})
			.catch((error) => {
				// TODO: What should be done with errors here?
				throw error
			})
	}

	public uploadStill(index: number, data: Buffer, name: string, description: string): Promise<DataTransfer> {
		const transfer = new DataTransferStill(this.nextTransferIndex, index, data, name, description)
		return this.stillsLock.enqueue(transfer)
	}

	public uploadMultiViewerLabel(index: number, data: Buffer): Promise<DataTransfer> {
		const transfer = new DataTransferMultiViewerLabel(this.nextTransferIndex, index, data)
		return this.labelsLock.enqueue(transfer)
	}

	public uploadClip(
		index: number,
		data: Iterable<Buffer> | AsyncIterable<Buffer>,
		name: string
	): Promise<DataTransfer> {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this
		const provideFrame = async function* (): AsyncGenerator<DataTransferFrame> {
			let id = -1
			for await (const frame of data) {
				id++
				yield new DataTransferFrame(that.nextTransferIndex, 1 + index, id, frame)
			}
		}
		const transfer = new DataTransferClip(index, name, provideFrame())
		const lock = this.getClipLock(index)
		return lock.enqueue(transfer)
	}

	public uploadAudio(index: number, data: Buffer, name: string): Promise<DataTransfer> {
		const transfer = new DataTransferAudio(this.nextTransferIndex, 1 + index, data, name)
		const lock = this.getClipLock(index)
		return lock.enqueue(transfer)
	}

	public downloadMacro(index: number): Promise<Buffer> {
		const transfer = new DataDownloadMacro(this.nextTransferIndex, index)

		return this.macroLock.enqueue(transfer).then((transfer) => (transfer as DataDownloadMacro).data)
	}

	public uploadMacro(index: number, data: Buffer, name: string): Promise<DataTransfer> {
		const transfer = new DataUploadMacro(this.nextTransferIndex, index, data, name)

		return this.macroLock.enqueue(transfer)
	}

	private get nextTransferIndex(): number {
		const index = this.transferIndex++
		if (this.transferIndex > MAX_TRANSFER_INDEX) this.transferIndex = 0
		return index
	}

	private getClipLock(index: number): DataLock {
		const lock = this.clipLocks[index]
		if (lock) {
			return lock
		} else {
			throw new Error('Invalid clip id')
		}
	}
}
