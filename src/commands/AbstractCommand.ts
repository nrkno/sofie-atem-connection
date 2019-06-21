import { AtemState } from '../state'

export default abstract class AbstractCommand {
	static MaskFlags?: { [key: string]: number }
	abstract rawName: string
	packetId: number
	flag: number = 0

	resolve: (cmd: AbstractCommand) => void
	reject: (cmd: AbstractCommand) => void

	abstract properties: any

	deserialize? (rawCommand: Buffer): void
	serialize? (): Buffer
	applyToState? (state: AtemState): void

	updateProps (newProps: object) {
		this._updateProps(newProps)
	}

	protected _updateProps (newProps: Object) {
		this.properties = {
			...this.properties,
			...newProps
		}
		const maskFlags = (this.constructor as any).MaskFlags as { [key: string]: number }

		if (maskFlags) {
			for (const key in newProps) {
				if (key in maskFlags) {
					this.flag = this.flag | maskFlags[key]
				}
			}
		}
	}
}
