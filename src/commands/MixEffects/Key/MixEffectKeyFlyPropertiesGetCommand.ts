import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { UpstreamKeyerFlySettings } from '../../../state/video/upstreamKeyers'
import { Util } from '../../..'

export class MixEffectKeyFlyPropertiesGetCommand extends AbstractCommand {
	rawName = 'KeFS'
	mixEffect: number
	upstreamKeyerId: number
	properties: UpstreamKeyerFlySettings

	deserialize (rawCommand: Buffer) {
		this.mixEffect = Util.parseNumberBetween(rawCommand[0], 0, 3)
		this.upstreamKeyerId = Util.parseNumberBetween(rawCommand[1], 0, 3)
		this.properties = {
			isASet: rawCommand[2] === 1,
			isBSet: rawCommand[3] === 1,
			isAtKeyFrame: rawCommand[6],
			runToInfiniteIndex: rawCommand[7]
		}
	}

	applyToState (state: AtemState) {
		const mixEffect = state.video.getMe(this.mixEffect)
		const upstreamKeyer = mixEffect.getUpstreamKeyer(this.upstreamKeyerId)
		upstreamKeyer.flyProperties = {
			...this.properties
		}
	}
}
