import { IPCMessageType } from './enums'
import { Util } from './lib/atemUtil'
import { AtemSocketChild } from './lib/atemSocketChild'

function sendParentMessage (message: {cmd: IPCMessageType; payload?: any}) {
	Util.sendIPCMessage(global, 'process', message, singleton.log.bind(singleton)).catch(() => { /* Discard errors. */ })
}

function onDisconnect () {
	sendParentMessage({
		cmd: IPCMessageType.Disconnect
	})
}

function onLog (message: string) {
	sendParentMessage({
		cmd: IPCMessageType.Log,
		payload: message
	})
}

function onCommandReceived (packet: Buffer, remotePacketId: number) {
	sendParentMessage({
		cmd: IPCMessageType.InboundCommand,
		payload: {
			packet,
			remotePacketId
		}
	})
}

function onCommandAcknowledged (packetId: number, trackingId: number) {
	sendParentMessage({
		cmd: IPCMessageType.CommandAcknowledged,
		payload: {
			packetId,
			trackingId
		}
	})
}

const singleton = new AtemSocketChild(onDisconnect, onLog, onCommandReceived, onCommandAcknowledged)
process.on('message', message => {
	if (typeof message !== 'object') {
		return
	}

	if (typeof message.cmd !== 'string' || message.cmd.length <= 0) {
		return
	}

	const payload = message.payload
	switch (message.cmd) {
		case IPCMessageType.Connect:
			singleton.connect(payload.address, payload.port)
			break
		case IPCMessageType.Disconnect:
			singleton.disconnect().catch(() => { /* discard error */ })
			break
		case IPCMessageType.OutboundCommand:
			singleton.sendCommand(Buffer.from(payload.data.data), payload.trackingId)
			break
	}
})

process.on('uncaughtException', error => {
	console.error('uncaughtException:', error)
	setTimeout(() => {
		process.exit(1)
	}, 10)
})

process.on('unhandledRejection', reason => {
	console.error('unhandledRejection:', reason)
	setTimeout(() => {
		process.exit(1)
	}, 10)
})
