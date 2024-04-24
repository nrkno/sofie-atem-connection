import { parentPort } from 'worker_threads'
import * as comlink from 'comlink'
import nodeEndpoint from 'comlink/dist/umd/node-adapter'
import { AtemSocketChild, OutboundPacketInfo } from './atemSocketChild'

if (!parentPort) {
	throw new Error('InvalidWorker')
}
parentPort.setMaxListeners(100)

export class Api {
	private tempChild: AtemSocketChild | undefined

	public init(
		debugBuffers: boolean,
		onDisconnect: () => Promise<void>,
		onLog: (message: string) => Promise<void>,
		onCommandsReceived: (payload: Buffer) => Promise<void>,
		onPacketsAcknowledged: (ids: Array<{ packetId: number; trackingId: number }>) => Promise<void>
	): void {
		if (this.tempChild) throw new Error('Already initialised!')

		this.tempChild = new AtemSocketChild(
			{
				debugBuffers,
			},
			onDisconnect,
			onLog,
			onCommandsReceived,
			onPacketsAcknowledged
		)
	}

	public async connect(address: string, port: number): Promise<void> {
		if (!this.tempChild) throw new Error('Not initialised!')

		await this.tempChild.connect(address, port)
	}

	public async disconnect(): Promise<void> {
		if (!this.tempChild) throw new Error('Not initialised!')

		await this.tempChild.disconnect()
	}

	public async sendPackets(packets: OutboundPacketInfo[]): Promise<void> {
		if (!this.tempChild) throw new Error('Not initialised!')

		this.tempChild.sendPackets(packets)
	}
}

comlink.expose(new Api(), nodeEndpoint(parentPort))
