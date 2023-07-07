import { FairlightAudioMasterLevelsState } from '../../state/fairlight'
import { AtemState, InvalidIdError } from '../../state'
import { DeserializedCommand } from '../CommandBase'
import * as Util from '../../lib/atemUtil'


export class FairlightMixerMasterLevelsUpdateCommand extends DeserializedCommand<
	FairlightAudioMasterLevelsState
> {
	public static readonly rawName = 'FDLv'

	public static deserialize(rawCommand: Buffer): FairlightMixerMasterLevelsUpdateCommand {
		const properties = {
			inputLeftLevel: Util.UInt16BEToDecibel(rawCommand.readUInt16BE(0)),
			inputRightLevel: Util.UInt16BEToDecibel(rawCommand.readUInt16BE(2)),
			inputLeftPeak: Util.UInt16BEToDecibel(rawCommand.readUInt16BE(4)),
			inputRightPeak: Util.UInt16BEToDecibel(rawCommand.readUInt16BE(6)),

			compressorGainReduction: Util.UInt16BEToDecibel(rawCommand.readUInt16BE(8)),
			limiterGainReduction: Util.UInt16BEToDecibel(rawCommand.readUInt16BE(10)),
		
			outputLeftLevel: Util.UInt16BEToDecibel(rawCommand.readUInt16BE(12)),
			outputRightLevel: Util.UInt16BEToDecibel(rawCommand.readUInt16BE(14)),
			outputLeftPeak: Util.UInt16BEToDecibel(rawCommand.readUInt16BE(16)),
			outputRightPeak: Util.UInt16BEToDecibel(rawCommand.readUInt16BE(18)),
		
			leftLevel: Util.UInt16BEToDecibel(rawCommand.readUInt16BE(20)),
			rightLevel: Util.UInt16BEToDecibel(rawCommand.readUInt16BE(22)),
			leftPeak: Util.UInt16BEToDecibel(rawCommand.readUInt16BE(24)),
			rightPeak: Util.UInt16BEToDecibel(rawCommand.readUInt16BE(26)),
		}

		return new FairlightMixerMasterLevelsUpdateCommand(properties)
	}

	public applyToState(state: AtemState): string {
		if (!state.fairlight) {
			throw new InvalidIdError('Fairlight')
		}

		if (!state.fairlight.master) {
			throw new InvalidIdError('Fairlight.Master')
		}

		state.fairlight.master.levels = this.properties

		return `fairlight.master.levels`
	}
}
