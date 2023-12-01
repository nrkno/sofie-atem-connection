import type { ProtocolVersion } from '../enums'
import type { ISerializableCommand } from '../commands'

export class PacketBuilder {
	readonly #maxPacketSize: number
	readonly #protocolVersion: ProtocolVersion

	readonly #completedBuffers: Buffer[] = []

	#finished = false
	#currentPacketBuffer: Buffer
	#currentPacketFilled: number

	constructor(maxPacketSize: number, protocolVersion: ProtocolVersion) {
		this.#maxPacketSize = maxPacketSize
		this.#protocolVersion = protocolVersion

		this.#currentPacketBuffer = Buffer.alloc(maxPacketSize)
		this.#currentPacketFilled = 0
	}

	public addCommand(cmd: ISerializableCommand): void {
		if (this.#finished) throw new Error('Packets have been finished')

		if (typeof cmd.serialize !== 'function') {
			throw new Error(`Command ${cmd.constructor.name} is not serializable`)
		}

		const rawName: string = (cmd.constructor as any).rawName
		const payload = cmd.serialize(this.#protocolVersion)

		const totalLength = payload.length + 8
		if (totalLength > this.#maxPacketSize) {
			throw new Error(`Comamnd ${cmd.constructor.name} is too large for a single packet`)
		}

		// Ensure the packet will fit into the current buffer
		if (totalLength + this.#currentPacketFilled > this.#maxPacketSize) {
			this.#finishBuffer()
		}

		// Add to packet
		this.#currentPacketBuffer.writeUInt16BE(payload.length + 8, this.#currentPacketFilled + 0)
		this.#currentPacketBuffer.write(rawName, this.#currentPacketFilled + 4, 4)
		payload.copy(this.#currentPacketBuffer, this.#currentPacketFilled + 8)

		this.#currentPacketFilled += totalLength
	}

	public getPackets(): Buffer[] {
		this.#finishBuffer(true)

		this.#finished = true

		return this.#completedBuffers
	}

	#finishBuffer(skipCreateNext?: boolean) {
		if (this.#currentPacketFilled === 0 || this.#finished) return

		this.#completedBuffers.push(this.#currentPacketBuffer.subarray(0, this.#currentPacketFilled))

		if (!skipCreateNext) {
			this.#currentPacketBuffer = Buffer.alloc(this.#maxPacketSize)
			this.#currentPacketFilled = 0
		}
	}
}
