import { FairlightAudioChannelLevelsState } from '../../state/fairlight'
import { AtemState, InvalidIdError } from '../../state'
import { DeserializedCommand } from '../CommandBase'


export class FairlightMixerMasterLevelsUpdateCommand extends DeserializedCommand<
	FairlightAudioChannelLevelsState
> {
	public static readonly rawName = 'FDLv'

	public static deserialize(rawCommand: Buffer): FairlightMixerMasterLevelsUpdateCommand {
		const properties = {
		inputLeftLevel: rawCommand.readUInt16BE(0),
      	inputRightLevel: rawCommand.readUInt16BE(2),
      	inputLeftPeak: rawCommand.readUInt16BE(4),
      	inputRightPeak: rawCommand.readUInt16BE(6),

      	compressorGainReduction: rawCommand.readUInt16BE(8),
      	limiterGainReduction: rawCommand.readUInt16BE(10),
      
      	outputLeftLevel: rawCommand.readUInt16BE(12),
      	outputRightLevel: rawCommand.readUInt16BE(14),
      	outputLeftPeak: rawCommand.readUInt16BE(16),
      	outputRightPeak: rawCommand.readUInt16BE(18),
      
      	leftLevel: rawCommand.readUInt16BE(20),
      	rightLevel: rawCommand.readUInt16BE(22),
      	leftPeak: rawCommand.readUInt16BE(24),
      	rightPeak: rawCommand.readUInt16BE(26),
      
		}

		return new FairlightMixerMasterLevelsUpdateCommand(properties)
	}

	public applyToState(state: AtemState): string {
		if (!state.fairlight) {
			throw new InvalidIdError('Fairlight')
		}

		state.fairlight.master = {
			levels: {
				inputLeftLevel: this.properties.inputLeftLevel,
				inputRightLevel: this.properties.inputRightLevel,
				inputLeftPeak: this.properties.inputLeftPeak,
				inputRightPeak: this.properties.inputRightPeak,
				
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

		return `fairlight.master`
	}
}
