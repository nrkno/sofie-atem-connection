import { Commands, Enums } from '..'

import DataLock from './dataLock'
import DataTransferFrame from './dataTransferFrame'
import DataTransferStill from './dataTransferStill'
import DataTransferClip from './dataTransferClip'
import DataTransferAudio from './dataTransferAudio'
import { ISerializableCommand } from '../commands/CommandBase'

const MAX_PACKETS_TO_SEND_PER_TICK = 10

export class DataTransferManager {
	readonly commandQueue: Array<ISerializableCommand> = []

	readonly stillsLock = new DataLock(0, this.commandQueue)
	readonly clip1Lock = new DataLock(1, this.commandQueue)
	readonly clip2Lock = new DataLock(2, this.commandQueue)

	readonly interval: NodeJS.Timer

	transferIndex = 0

	constructor (sendCommand: (command: ISerializableCommand) => Promise<ISerializableCommand>) {
		this.interval = setInterval(() => {
			if (this.commandQueue.length <= 0) {
				return
			}

			const commandsToSend = this.commandQueue.splice(0, MAX_PACKETS_TO_SEND_PER_TICK)
			commandsToSend.forEach(command => {
				sendCommand(command).catch(() => { /* discard error */ })
			})
		}, 0)
	}

	stop () {
		clearInterval(this.interval)
	}

	handleCommand (command: Commands.IDeserializedCommand) {
		const allLocks = [ this.stillsLock, this.clip1Lock, this.clip2Lock ]

		// try to establish the associated DataLock:
		let lock: DataLock | undefined
		if (command.constructor.name === Commands.LockObtainedCommand.name || command.constructor.name === Commands.LockStateUpdateCommand.name) {
			switch (command.properties.index) {
				case 0 :
					lock = this.stillsLock
					break
				case 1 :
					lock = this.clip1Lock
					break
				case 2 :
					lock = this.clip2Lock
					break
			}
		} else if (command.properties.storeId) {
			lock = allLocks[command.properties.storeId]
		} else if (command.properties.transferId !== undefined || command.properties.transferIndex !== undefined) {
			for (const _lock of allLocks) {
				if (_lock.transfer && (_lock.transfer.transferId === command.properties.transferId || _lock.transfer.transferId === command.properties.transferIndex)) {
					lock = _lock
				}
			}
		} else {
			// debugging:
			console.log('UNKNOWN COMMAND:', command)
			return
		}
		if (!lock) return

		// handle actual command
		if (command.constructor.name === Commands.LockObtainedCommand.name) {
			lock.lockObtained()
		}
		if (command.constructor.name === Commands.LockStateUpdateCommand.name) {
			if (!command.properties.locked) lock.lostLock()
			else lock.updateLock(command.properties.locked)
		}
		if (command.constructor.name === Commands.DataTransferErrorCommand.name) {
			lock.transferErrored(command.properties.errorCode)
		}
		if (lock.transfer) {
			lock.transfer.handleCommand(command)
			if (lock.transfer.state === Enums.TransferState.Finished) {
				lock.transferFinished()
			}
		}
	}

	uploadStill (index: number, data: Buffer, name: string, description: string) {
		const transfer = new DataTransferStill(this.transferIndex++, index, data, name, description)
		transfer.commandQueue = this.commandQueue

		this.stillsLock.enqueue(transfer)

		return transfer.promise
	}

	uploadClip (index: number, data: Array<Buffer>, name: string) {
		const transfer = new DataTransferClip(1 + index, name)
		transfer.commandQueue = this.commandQueue

		for (const frameId in data) {
			const frame = data[frameId]
			const frameTransfer = new DataTransferFrame(this.transferIndex++, 1 + index, Number(frameId), frame)

			frameTransfer.commandQueue = this.commandQueue
			// frameTransfer.hash = crypto.createHash('md5').update(frame).digest().toString()

			transfer.frames.push(frameTransfer)
		}

		[ this.clip1Lock, this.clip2Lock ][index].enqueue(transfer)

		return transfer.promise
	}

	uploadAudio (index: number, data: Buffer, name: string) {
		const transfer = new DataTransferAudio(this.transferIndex++, 1 + index, data, name)
		transfer.commandQueue = this.commandQueue

		;[ this.clip1Lock, this.clip2Lock ][index].enqueue(transfer)

		return transfer.promise
	}

}
