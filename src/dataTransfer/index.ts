import { Commands, Enums } from '..'
import * as crypto from 'crypto'

import DataLock from './dataLock'
import DataTransferFrame from './dataTransferFrame'
import DataTransferStill from './dataTransferStill'
import DataTransferClip from './dataTransferClip'
import DataTransferAudio from './dataTransferAudio'

const MAX_PACKETS_TO_SEND_PER_TICK = 10

export class DataTransferManager {
	readonly commandQueue: Array<Commands.AbstractCommand> = []

	readonly stillsLock = new DataLock(0, this.commandQueue)
	readonly clip1Lock = new DataLock(1, this.commandQueue)
	readonly clip2Lock = new DataLock(2, this.commandQueue)

	readonly interval: NodeJS.Timer

	transferIndex = 0

	constructor (sendCommand: (command: Commands.AbstractCommand) => Promise<Commands.AbstractCommand>) {
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

	handleCommand (command: Commands.AbstractCommand) {
		const allLocks = [ this.stillsLock, this.clip1Lock, this.clip2Lock ]

		// try to establish the associated DataLock:
		let lock: DataLock | undefined
		if (command.constructor.name === Commands.LockObtainedCommand.name || command.constructor.name === Commands.LockStateCommand.name) {
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
		if (command.constructor.name === Commands.LockStateCommand.name) {
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
		const transfer = new DataTransferStill()
		const ps = new Promise((resolve, reject) => {
			transfer.finish = resolve
			transfer.fail = reject
		})

		transfer.commandQueue = this.commandQueue
		transfer.transferId = this.transferIndex++
		transfer.storeId = 0
		transfer.frameId = index
		transfer.data = data
		transfer.hash = crypto.createHash('md5').update(data).digest().toString()
		transfer.description = { name, description }

		this.stillsLock.enqueue(transfer)

		return ps
	}

	uploadClip (index: number, data: Array<Buffer>, name: string) {
		const transfer = new DataTransferClip()
		const ps = new Promise((resolve, reject) => {
			transfer.finish = resolve
			transfer.fail = reject
		})

		transfer.commandQueue = this.commandQueue
		transfer.storeId = 1 + index
		transfer.clipIndex = index
		transfer.description = { name }

		for (const frameId in data) {
			const frame = data[frameId]
			const frameTransfer = new DataTransferFrame()

			frameTransfer.commandQueue = this.commandQueue
			frameTransfer.transferId = this.transferIndex++
			frameTransfer.storeId = 1 + index
			frameTransfer.frameId = Number(frameId)
			frameTransfer.data = frame
			// frameTransfer.hash = crypto.createHash('md5').update(frame).digest().toString()

			transfer.frames.push(frameTransfer)
		}

		[ this.clip1Lock, this.clip2Lock ][index].enqueue(transfer)

		return ps
	}

	uploadAudio (index: number, data: Buffer, name: string) {
		const transfer = new DataTransferAudio()
		const ps = new Promise((resolve, reject) => {
			transfer.finish = resolve
			transfer.fail = reject
		})

		transfer.commandQueue = this.commandQueue
		transfer.transferId = this.transferIndex++
		transfer.storeId = 1 + index
		transfer.description = { name }
		transfer.data = data
		transfer.hash = crypto.createHash('md5').update(data).digest().toString()

		;[ this.clip1Lock, this.clip2Lock ][index].enqueue(transfer)

		return ps
	}

}
