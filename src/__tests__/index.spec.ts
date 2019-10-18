import { Atem, Enums } from '../index'

function cleanupAtem (atem: Atem) {
	const atem2 = atem as any
	atem2.dataTransferManager.stopCommandSending()
}

test('Simple test', async () => {
	const nb = new Atem({ disableMultithreaded: true })
	try {
		nb.on('error', () => null)

		expect(nb).toBeTruthy()
	} finally {
		cleanupAtem(nb)
	}
})

function createConnection (apiVersion: Enums.ProtocolVersion) {
	const conn = new Atem({ debug: true, disableMultithreaded: true })
	// conn.on('error', () => null)
	conn.sendCommand = jest.fn()
	conn.state.info.apiVersion = apiVersion

	return conn
}

test('setSuperSourceProperties - 7.2', async () => {
	const conn = createConnection(Enums.ProtocolVersion.V7_2)
	try {
		expect(conn.sendCommand).not.toHaveBeenCalled()

		await conn.setSuperSourceProperties({
			artPreMultiplied: true,
			artOption: Enums.SuperSourceArtOption.Background
		}, 2)
		expect(conn.sendCommand).toHaveBeenCalledTimes(1)
		expect(conn.sendCommand).toHaveBeenNthCalledWith(1, {
			flag: 12,
			_properties: {
				artOption: 0,
				artPreMultiplied: true
			}
		})
	} finally {
		cleanupAtem(conn)
	}
})

test('setSuperSourceProperties - 8.0', async () => {
	const conn = createConnection(Enums.ProtocolVersion.V8_0)
	try {
		expect(conn.sendCommand).not.toHaveBeenCalled()

		await conn.setSuperSourceProperties({
			artPreMultiplied: true,
			artOption: Enums.SuperSourceArtOption.Background
		}, 2)
		expect(conn.sendCommand).toHaveBeenCalledTimes(1)
		expect(conn.sendCommand).toHaveBeenNthCalledWith(1, {
			ssrcId: 2,
			flag: 12,
			_properties: {
				artOption: 0,
				artPreMultiplied: true
			}
		})
	} finally {
		cleanupAtem(conn)
	}
})

test('setSuperSourceBorder - 7.2', async () => {
	const conn = createConnection(Enums.ProtocolVersion.V7_2)
	try {
		expect(conn.sendCommand).not.toHaveBeenCalled()

		await conn.setSuperSourceBorder({
			borderBevelSoftness: 12,
			borderLuma: 3
		}, 2)
		expect(conn.sendCommand).toHaveBeenCalledTimes(1)
		expect(conn.sendCommand).toHaveBeenNthCalledWith(1, {
			flag: 139264,
			_properties: {
				borderBevelSoftness: 12,
				borderLuma: 3
			}
		})
	} finally {
		cleanupAtem(conn)
	}
})

test('setSuperSourceBorder - 8.0', async () => {
	const conn = createConnection(Enums.ProtocolVersion.V8_0)
	try {
		expect(conn.sendCommand).not.toHaveBeenCalled()

		await conn.setSuperSourceBorder({
			borderBevelSoftness: 12,
			borderLuma: 3
		}, 2)
		expect(conn.sendCommand).toHaveBeenCalledTimes(1)
		expect(conn.sendCommand).toHaveBeenNthCalledWith(1, {
			ssrcId: 2,
			flag: 1088,
			_properties: {
				borderBevelSoftness: 12,
				borderLuma: 3
			}
		})
	} finally {
		cleanupAtem(conn)
	}
})
