import { Commands, Enums } from '..'

export default abstract class DataTransfer {
	state: Enums.TransferState = Enums.TransferState.Queued
	readonly transferId: number
	readonly storeId: number

	commandQueue: Array<Commands.ISerializableCommand>

	private readonly completionPromise: Promise<DataTransfer>
	resolvePromise: (value?: DataTransfer | PromiseLike<DataTransfer> | undefined) => void
	rejectPromise: (reason?: any) => void

	constructor (transferId: number, storeId: number) {
		this.transferId = transferId
		this.storeId = storeId

		// Make typescript happy
		// tslint:disable-next-line: no-empty
		this.resolvePromise = () => {}
		// tslint:disable-next-line: no-empty
		this.rejectPromise = () => {}

		this.completionPromise = new Promise((resolve, reject) => {
			this.resolvePromise = resolve
			this.rejectPromise = reject
		})
	}

	get promise () {
		return this.completionPromise
	}

	fail (..._args: any[]): void {} // TODO remove

	abstract start (): void

	abstract handleCommand (command: Commands.IDeserializedCommand): void
	abstract gotLock (): void
}
