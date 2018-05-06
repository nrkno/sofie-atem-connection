import AbstractCommand from '../../AbstractCommand'
import { AtemState } from '../../../state'
import { UpstreamKeyerFlySettings } from '../../../state/video/upstreamKeyers'

export class MixEffectKeyFlyPropertiesGetCommand extends AbstractCommand {
	rawName = 'KeFS'
	mixEffect: number
	upstreamKeyerId: number
	properties: UpstreamKeyerFlySettings

	deserialize (rawCommand: Buffer) {
		this.mixEffect = rawCommand[0]
		this.upstreamKeyerId = rawCommand[1]
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
