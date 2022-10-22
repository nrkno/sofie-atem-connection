import { SymmetricalCommand } from '../CommandBase'
import { InvalidIdError, AtemState } from '../../state'
import { ProtocolVersion } from '../../enums'
import { StreamingAudiobitrates } from '../../state/streaming'

export class StreamingAudiobitratesCommand extends SymmetricalCommand<StreamingAudiobitrates> {
	public static readonly rawName = 'STAB'
	public static readonly minimumVersion = ProtocolVersion.V8_1_1

	constructor(upto30fps = 128000, morethan30fps = 128000) {
		super({ upto30fps, morethan30fps })
	}

	public serialize(): Buffer {
		const buffer = Buffer.alloc(8)
		const upto30fps = this.properties.upto30fps || 128000
		const morethan30fps = this.properties.morethan30fps || 128000
		buffer.writeUInt32BE(upto30fps, 0)
		buffer.writeUInt32BE(morethan30fps, 4)
		return buffer
	}

	public static deserialize(rawCommand: Buffer): StreamingAudiobitratesCommand {
        const upto30fps = rawCommand.readUInt32BE(0)
		const morethan30fps = rawCommand.readUInt32BE(4)

		return new StreamingAudiobitratesCommand(upto30fps, morethan30fps)
	}

	public applyToState(state: AtemState): string {
		const audiobitrates = {
            upto30fps: this.properties.upto30fps,
            morethan30fps: this.properties.morethan30fps,
        }
		if (!state.streaming) {
             throw new InvalidIdError('Streaming')
		} else {
			state.streaming.audiobitrates = audiobitrates
		}

		return `streaming.audiobitrates`
	}
}
