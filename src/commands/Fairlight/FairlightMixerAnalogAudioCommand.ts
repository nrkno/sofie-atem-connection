import { AtemState, InvalidIdError } from '../../state'
import { FairlightAudioInputAnalog } from '../../state/fairlight'
import * as Util from '../../lib/atemUtil'
import { DeserializedCommand, WritableCommand } from '../CommandBase'
import { OmitReadonly } from '../../lib/types'

/**
 * TODO - how does this not clash with the normal update command?
 */

export class FairlightMixerAnalogAudioCommand extends WritableCommand<OmitReadonly<FairlightAudioInputAnalog>> {
	public static readonly rawName = 'CFAA'

	public readonly index: number

	constructor(index: number) {
		super()

		this.index = index
	}

	public serialize(): Buffer {
		const buffer = Buffer.alloc(4)
		buffer.writeUInt16BE(this.index, 0)

		buffer.writeUInt8(this.properties.inputLevel || 0, 2)

		return buffer
	}
}

export class FairlightMixerAnalogAudioUpdateCommand extends DeserializedCommand<FairlightAudioInputAnalog> {
	public static readonly rawName = 'FAAI'

	public readonly index: number

	constructor(index: number, properties: FairlightAudioInputAnalog) {
		super(properties)

		this.index = index
	}

	public static deserialize(rawCommand: Buffer): FairlightMixerAnalogAudioUpdateCommand {
		const index = rawCommand.readUInt16BE(0)

		const properties = {
			supportedInputLevels: Util.getComponents(rawCommand.readUInt8(3)),
			inputLevel: rawCommand.readUInt8(4)
		}

		return new FairlightMixerAnalogAudioUpdateCommand(index, properties)
	}

	public applyToState(state: AtemState): string {
		if (!state.fairlight) {
			throw new InvalidIdError('Fairlight')
		}

		// TODO
		// state.fairlight.inputs[this.index] = {
		// 	sources: {},
		// 	...state.fairlight.inputs[this.index],
		// 	properties: this.properties
		// }
		return `fairlight.inputs.${this.index}.properties`
	}
}
