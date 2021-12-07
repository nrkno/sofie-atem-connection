import { DownloadRequestType, TransferMode, TransferState } from '../enums'
import { Commands } from '..'

import DataTransfer from './dataTransfer'
import DataTransferFrame from './dataTransferFrame'

export class DataDownloadMacro extends DataTransfer {
	public data = Buffer.from([])
	public curFrame = 0

	constructor(transferId: number, public readonly macroIndex: number) {
		super(transferId, 255)
	}

	public start(): Commands.ISerializableCommand[] {
		const commands: Commands.ISerializableCommand[] = [
            new Commands.DataTransferDownloadRequestCommand({
                transferId: this.transferId,
                transferStoreId: 0xffff,
                transferIndex: this.macroIndex,
				transferType: DownloadRequestType.Macro,
            })
        ]
		return commands
	}

	public handleCommand(command: Commands.IDeserializedCommand): Commands.ISerializableCommand[] {
		const commands: Commands.ISerializableCommand[] = []

        if (command.constructor.name === Commands.DataTransferDataCommand.name) {
            this.data = (command as Commands.DataTransferDataCommand).properties.body

            // todo - have we received all data? maybe check if the command.body < max_len

            commands.push(new Commands.DataTransferAckCommand({
                transferId: this.transferId,
                transferIndex: this.macroIndex
            }))
        } else if (command.constructor.name === Commands.DataTransferCompleteCommand.name) {
            this.state = TransferState.Finished
            this.resolvePromise(this)
		}

		return commands
	}

	public gotLock(): Commands.ISerializableCommand[] {
		// yeah so locks don't exist here...
		return this.start()
	}
}


export class DataUploadMacro extends DataTransferFrame {

	constructor(transferId: number, public readonly macroIndex: number, public readonly data: Buffer, private name: string) {
		super(transferId, 255, 0, data)
	}

	public start(): Commands.ISerializableCommand[] {
		const commands: Commands.ISerializableCommand[] = [
            new Commands.DataTransferUploadRequestCommand({
                transferId: this.transferId,
                transferStoreId: 0xffff,
                transferIndex: this.macroIndex,
				size: this.data.length,
				mode: TransferMode.Write2 | TransferMode.Clear2,
            })
        ]
		return commands
	}

	public handleCommand (command: Commands.IDeserializedCommand): Commands.ISerializableCommand[] {
		const res = super.handleCommand(command)

		if (this.state === TransferState.Finished) {
            this.resolvePromise(this)
		}

		return res
	}
	
	public sendDescription(): Commands.ISerializableCommand {
		return new Commands.DataTransferFileDescriptionCommand({
			name: this.name,
			fileHash: '',
			transferId: this.transferId,
		})
	}
}
