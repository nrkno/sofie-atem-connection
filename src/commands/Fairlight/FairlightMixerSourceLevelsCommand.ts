import { FairlightAudioSourceLevelsState } from '../../state/fairlight'
import { AtemState, InvalidIdError } from '../../state'
import { DeserializedCommand } from '../CommandBase'


export class FairlightMixerSourceLevelsUpdateCommand extends DeserializedCommand<
    FairlightAudioSourceLevelsState
> {
	public static readonly rawName = 'FMLv'

    public readonly index: number
    public readonly source: bigint

	constructor(index: number, source: bigint, props: FairlightMixerSourceLevelsUpdateCommand['properties']) {
		super(props)

		this.index = index
		this.source = source
	}

	public static deserialize(rawCommand: Buffer): FairlightMixerSourceLevelsUpdateCommand {
		const source = rawCommand.readBigInt64BE(0)
		const index = rawCommand.readUInt16BE(8)
		const properties = {
		inputLeftLevel: rawCommand.readUInt16BE(10),
      	inputRightLevel: rawCommand.readUInt16BE(12),
      	inputLeftPeak: rawCommand.readUInt16BE(14),
      	inputRightPeak: rawCommand.readUInt16BE(16),

      	expanderGainReduction: rawCommand.readUInt16BE(18),
        compressorGainReduction: rawCommand.readUInt16BE(20),
      	limiterGainReduction: rawCommand.readUInt16BE(22),
      
      	outputLeftLevel: rawCommand.readUInt16BE(24),
      	outputRightLevel: rawCommand.readUInt16BE(26),
      	outputLeftPeak: rawCommand.readUInt16BE(28),
      	outputRightPeak: rawCommand.readUInt16BE(30),
      
      	leftLevel: rawCommand.readUInt16BE(32),
      	rightLevel: rawCommand.readUInt16BE(34),
      	leftPeak: rawCommand.readUInt16BE(36),
      	rightPeak: rawCommand.readUInt16BE(38),
      
		}

		return new FairlightMixerSourceLevelsUpdateCommand(properties)
	}

	public applyToState(state: AtemState): string {
		if (!state.fairlight) {
			throw new InvalidIdError('Fairlight')
		}

		const input: FairlightAudioInput = state.fairlight.inputs[this.index] || { sources: {} }
		state.fairlight.inputs[this.index] = input

		const sourceIdStr = this.source.toString()
		const oldSource = input.sources[sourceIdStr]

		input.sources[sourceIdStr] = {
			...oldSource,
            levels: {
				inputLeftLevel: this.properties.inputLeftLevel,
				inputRightLevel: this.properties.inputRightLevel,
				inputLeftPeak: this.properties.inputLeftPeak,
				inputRightPeak: this.properties.inputRightPeak,
				
        		expanderGainReduction: this.properties.expanderGainReduction,
                compressorGainReduction: this.properties.compressorGainReduction,
				limiterGainReduction: this.properties.limiterGainReduction,
        
				outputLeftLevel: this.properties.outputLeftLevel,
				outputRightLevel: this.properties.outputRightLevel,
				outputLeftPeak: this.properties.outputLeftPeak,
				outputRightPeak: this.properties.outputRightPeak,
        
				leftLevel: this.properties.leftLevel,
				rightLevel: this.properties.rightLevel,
				leftPeak: this.properties.leftPeak,
				rightPeak: this.properties.rightPeak,
			},
		}

		return `fairlight.inputs.${this.index}.sources.${sourceIdStr}.levels`
	}
}
