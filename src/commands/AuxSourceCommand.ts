import AbstractCommand from './AbstractCommand'
import { AtemState } from '../state'

export class AuxSourceCommand extends AbstractCommand {
	static readonly rawName = 'CAuS'

	readonly auxBus: number

	readonly properties: Readonly<{
		source: number
	}>

	constructor (auxBus: number, source: number) {
		super()

		this.auxBus = auxBus
		this.properties = { source }
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(0x01, 0)
		buffer.writeUInt8(this.auxBus, 1)
		buffer.writeUInt16BE(this.properties.source, 2)
		return buffer
	}
}

export class AuxSourceUpdateCommand extends AbstractCommand {
	static readonly rawName = 'AuxS'

	readonly auxBus: number

	readonly properties: Readonly<{
		source: number
	}>

	constructor (auxBus: number, properties: AuxSourceUpdateCommand['properties']) {
		super()

		this.auxBus = auxBus
		this.properties = properties
	}

	static deserialize (rawCommand: Buffer): AuxSourceUpdateCommand {
		const auxBus = rawCommand[0]
		const properties = {
			source: rawCommand.readUInt16BE(2)
		}

		return new AuxSourceUpdateCommand(auxBus, properties)
	}

	applyToState (state: AtemState) {
		state.video.auxilliaries[this.auxBus] = this.properties.source
		return `video.auxilliaries.${this.auxBus}`
	}
}
