import { AtemState } from '../state'

export default abstract class AbstractCommand {
	abstract rawName: string
	packetId: number
	MaskFlags?: { [key: string]: number }
	flag: number = 0

	resolve: (cmd: AbstractCommand) => void
	reject: (cmd: AbstractCommand) => void

	abstract properties: any

	abstract deserialize (rawCommand: Buffer): void
	abstract serialize (): Buffer
	abstract applyToState (state: AtemState): void

	updateProps (newProps: object) {
		this._updateProps(newProps)
	}

	protected _updateProps (newProps: Object) {
		this.properties = {
			...this.properties,
			...newProps
		}

		if (this.MaskFlags) {
			for (const key in newProps) {
				if (key in this.MaskFlags) {
					this.flag = this.flag | this.MaskFlags[key]
				}
			}
		}
	}
}
