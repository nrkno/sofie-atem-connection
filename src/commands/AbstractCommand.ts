import { AtemState } from '../state'
import { ProtocolVersion } from '../enums'


export default abstract class AbstractCommand {
	static readonly MaskFlags?: { [key: string]: number }
	static readonly minimumVersion?: ProtocolVersion

	// static abstract rawName: string

	// abstract rawName: string
	packetId: number
	flag: number = 0
	// minimumVersion?: ProtocolVersion

	resolve: (cmd: AbstractCommand) => void
	reject: (cmd: AbstractCommand) => void

	abstract properties: any

	// deserialize? (rawCommand: Buffer, version: ProtocolVersion): void
	serialize? (version: ProtocolVersion): Buffer

	applyToState? (state: AtemState): string | string[]

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

export abstract class BasicWritableCommand<T> extends AbstractCommand {
	properties: T

	public serialize? (version: ProtocolVersion): Buffer
}

export abstract class WritableCommand<T> extends BasicWritableCommand<Partial<T>> {
	static readonly MaskFlags?: { [key: string]: number }

	flag: number

	constructor () {
		super()

		this.flag = 0
		this.properties = {}
	}

	public updateProps (newProps: Partial<T>) {
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
