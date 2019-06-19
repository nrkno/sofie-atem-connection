import { Atem } from '../index'

function cleanupAtem (atem: Atem) {
	const atem2 = atem as any
	atem2.dataTransferManager.stop()

	const sock = atem2.socket._socketProcess
	sock.removeAllListeners()
	sock.kill()
}

test('Simple test', async () => {
	const nb = new Atem()
	try {
		nb.on('error', () => null)

		expect(nb).toBeTruthy()
	} finally {
		cleanupAtem(nb)
	}
})
