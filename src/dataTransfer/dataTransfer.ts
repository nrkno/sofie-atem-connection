import { Commands, Enums } from '..'

export default abstract class DataTransfer {
	public state: Enums.TransferState = Enums.TransferState.Queued
	public readonly _transferId: number
	public readonly storeId: number

	private readonly completionPromise: Promise<DataTransfer>
	public resolvePromise: (value: DataTransfer | PromiseLike<DataTransfer>) => void
	public rejectPromise: (reason?: any) => void

	constructor(transferId: number, storeId: number) {
		this._transferId = transferId
		this.storeId = storeId

		// Make typescript happy
		this.resolvePromise = (): void => {
			// Ignore
		}
		this.rejectPromise = (): void => {
			// Ignore
		}

		this.completionPromise = new Promise<DataTransfer>((resolve, reject) => {
			this.resolvePromise = resolve
			this.rejectPromise = reject
		})
	}

	get transferId(): number {
		return this._transferId
	}

	get promise(): Promise<DataTransfer> {
		return this.completionPromise
	}

	public abstract start(): Commands.ISerializableCommand[]

	public abstract handleCommand(command: Commands.IDeserializedCommand): Commands.ISerializableCommand[]
	public abstract gotLock(): Commands.ISerializableCommand[]
}
