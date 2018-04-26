import { AtemState } from '../state'

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

export default abstract class AbstractCommand implements IAbstractCommand {
	rawName: string
	packetId: number
	MaskFlags: any
	flag: number

	resolve: (cmd: AbstractCommand) => void
	reject: (cmd: AbstractCommand) => void

	protected abstract _properties: any

	abstract deserialize (rawCommand: Buffer): void
	abstract serialize (): Buffer
	abstract getAttributes (): any
	abstract applyToState (state: AtemState): void

	get properties () {
		return this._properties
	}

	protected _updateProps (newProps: Object) {
		this._properties = {
			...this.properties,
			...newProps
		}

		for (let key in newProps) {
			if ((this.MaskFlags as any)[key]) {
				this.flag = this.flag | (this.MaskFlags as any)[key]
			}
		}
	}
}
