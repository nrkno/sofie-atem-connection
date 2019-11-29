import AbstractCommand from './AbstractCommand'
import { AtemState } from '../state'

export class TallyBySourceCommand extends AbstractCommand {
	rawName = 'TlSr'
	auxBus: number

	properties: {
		[source: number]: { program: boolean, preview: boolean } | undefined
	}

	deserialize (rawCommand: Buffer) {
		const sourceCount = rawCommand.readUInt16BE(0)

		const sources: TallyBySourceCommand['properties'] = {}
		for (let i = 0; i < sourceCount; i++) {
			const source = rawCommand.readUInt16BE(2 + (i * 3))
			const value = rawCommand.readUInt8(4 + (i * 3))
			sources[source] = {
				program: (value & 0x01) > 0,
				preview: (value & 0x02) > 0
			}
		}

		this.properties = sources
	}

	applyToState (_state: AtemState) {
		return []
	}
}
