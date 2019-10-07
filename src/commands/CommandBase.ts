import { AtemState } from '../state'
import { ProtocolVersion } from '../enums'

export interface IDeserializedCommand {
	properties: any

	applyToState (state: AtemState): string | string[]
}

export abstract class DeserializedCommand<T> implements IDeserializedCommand {
	static readonly minimumVersion?: ProtocolVersion

	readonly properties: Readonly<T>

	constructor (properties: T) {
		this.properties = properties
	}

	abstract applyToState (state: AtemState): string | string[]
}

export interface ISerializableCommand {
	serialize (version: ProtocolVersion): Buffer
}

export abstract class BasicWritableCommand<T> implements ISerializableCommand {
	static readonly MaskFlags?: { [key: string]: number }
	static readonly minimumVersion?: ProtocolVersion

	properties: T

	constructor (properties: T) {
		this.properties = properties
	}

	abstract serialize (version: ProtocolVersion): Buffer
}

export abstract class WritableCommand<T> extends BasicWritableCommand<Partial<T>> {
	static readonly MaskFlags?: { [key: string]: number }

	flag: number

	constructor () {
		super({})

		this.flag = 0
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
