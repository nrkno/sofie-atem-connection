import { Commands, Enums } from '..'

export default abstract class DataTransfer {
	public state: Enums.TransferState = Enums.TransferState.Queued
	public readonly transferId: number
	public readonly storeId: number

	// commandQueue: Array<Commands.ISerializableCommand>

	private readonly completionPromise: Promise<DataTransfer>
	public resolvePromise: (value?: DataTransfer | PromiseLike<DataTransfer> | undefined) => void
	public rejectPromise: (reason?: any) => void

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

	public abstract start (): Commands.ISerializableCommand[]

	public abstract handleCommand (command: Commands.IDeserializedCommand): Commands.ISerializableCommand[]
	public abstract gotLock (): Commands.ISerializableCommand[]
}
