import { IPCMessageType } from './enums'
import { Util } from './lib/atemUtil'
import { AtemSocketChild } from './lib/atemSocketChild'

const singleton = new AtemSocketChild()
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
			singleton._sendCommand(Buffer.from(payload.data.data), payload.trackingId)
			break
	}
})

singleton.on(IPCMessageType.Disconnect, () => {
	sendParentMessage({
		cmd: IPCMessageType.Disconnect
	}).catch(() => { /* Discard errors. */ })
})

singleton.on('log', (message: string) => {
	sendParentMessage({
		cmd: IPCMessageType.Log,
		payload: message
	}).catch(() => { /* Discard errors. */ })
})

singleton.on(IPCMessageType.InboundCommand, (packet: Buffer, remotePacketId: number) => {
	sendParentMessage({
		cmd: IPCMessageType.InboundCommand,
		payload: {
			packet,
			remotePacketId
		}
	}).catch(() => { /* Discard errors. */ })
})

singleton.on(IPCMessageType.CommandAcknowledged, (commandId: number, trackingId: number) => {
	sendParentMessage({
		cmd: IPCMessageType.CommandAcknowledged,
		payload: {
			commandId,
			trackingId
		}
	}).catch(() => { /* Discard errors. */ })
})

function sendParentMessage (message: {cmd: IPCMessageType; payload?: any}) {
	return Util.sendIPCMessage(global, 'process', message, singleton.log)
}
