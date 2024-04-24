import { parentPort } from 'worker_threads'
import * as comlink from 'comlink'
import nodeEndpoint from 'comlink/dist/umd/node-adapter'
import { AtemSocketChild, OutboundPacketInfo } from './atemSocketChild'

if (!parentPort) {
	throw new Error('InvalidWorker')
}

export interface InitData {
	debugBuffers: boolean
	onDisconnect: () => Promise<void>
	onLog: (message: string) => Promise<void>
	onCommandsReceived: (payload: Buffer) => Promise<void>
	onPacketsAcknowledged: (ids: Array<{ packetId: number; trackingId: number }>) => Promise<void>
}

export class Api {
	private tempChild: AtemSocketChild | undefined

	public init({ debugBuffers, onDisconnect, onLog, onCommandsReceived, onPacketsAcknowledged }: InitData): void {
		if (this.tempChild) throw new Error('Already initialised!')

		this.tempChild = new AtemSocketChild(
			{
				address: '127.0.0.1', // TODO - remove?
				port: 9910,
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

setInterval(() => {
	console.log('im alive')
}, 1000)

setTimeout(() => {
	process.exit(1)
}, 5000)

comlink.expose(new Api(), nodeEndpoint(parentPort))
