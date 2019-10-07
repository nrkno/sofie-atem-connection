import { BasicWritableCommand, DeserializedCommand } from './CommandBase'
import { AtemState } from '../state'

export interface AuxSourceProps {
	source: number
}

export class AuxSourceCommand extends BasicWritableCommand<AuxSourceProps> {
	static readonly rawName = 'CAuS'

	readonly auxBus: number

	constructor (auxBus: number, source: number) {
		super({ source })

		this.auxBus = auxBus
	}

	serialize () {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt8(0x01, 0)
		buffer.writeUInt8(this.auxBus, 1)
		buffer.writeUInt16BE(this.properties.source, 2)
		return buffer
	}
}

export class AuxSourceUpdateCommand extends DeserializedCommand<AuxSourceProps> {
	static readonly rawName = 'AuxS'

	readonly auxBus: number

	constructor (auxBus: number, properties: AuxSourceProps) {
		super(properties)

		this.auxBus = auxBus
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
