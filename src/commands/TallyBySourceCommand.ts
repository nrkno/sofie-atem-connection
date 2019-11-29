import { DeserializedCommand } from './CommandBase'
import { AtemState } from '../state'

export interface TallyBySourceProps {
	[source: number]: { program: boolean, preview: boolean } | undefined
}

export class TallyBySourceCommand extends DeserializedCommand<TallyBySourceProps> {
	static readonly rawName = 'TlSr'

	static deserialize (rawCommand: Buffer) {
		const sourceCount = rawCommand.readUInt16BE(0)

		const sources: TallyBySourceProps = {}
		for (let i = 0; i < sourceCount; i++) {
			const source = rawCommand.readUInt16BE(2 + (i * 3))
			const value = rawCommand.readUInt8(4 + (i * 3))
			sources[source] = {
				program: (value & 0x01) > 0,
				preview: (value & 0x02) > 0
			}
		}

		return new TallyBySourceCommand(sources)
	}

	applyToState (_state: AtemState) {
		return []
	}
}
