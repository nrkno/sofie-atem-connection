import { BasicAtem } from '../atem'
import { ProtocolVersion } from '../enums'
import { ISerializableCommand } from '../commands'
import { AtemCommandSender } from './atemCommands'

export class AtemCommandBatch extends AtemCommandSender<void> {
	readonly #client: BasicAtem
	#queuedCommands: ISerializableCommand[] = []

	protected get apiVersion(): ProtocolVersion | undefined {
		return this.#client.state?.info?.apiVersion
	}

	constructor(client: BasicAtem) {
		super()

		this.#client = client
	}

	async sendQueued(): Promise<void> {
		const commands = this.#queuedCommands
		this.#queuedCommands = []

		// TODO
	}

	protected sendCommand(command: ISerializableCommand): void {
		this.#queuedCommands.push(command)
	}
}
