import { Atem } from '../index'
import { CommandParser } from '../lib/atemCommandParser'

const DataV8 = require('./data-v8.0.json') as TestCase[]

export interface TestCase {
	name: string
	bytes: string
	command: { [key: string]: any }
}

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

const idAliases: { [key: string]: string } = {
	'auxBus': 'id',
	'index': 'index'
}
const propertyAliases: { [key: string]: string } = {
	'programOutFollowFadeToBlack': 'followFadeToBlack'
}
const propertyConversion: { [key: string]: (v: any) => any } = {
	'balance': (v: number) => Math.round(v * 10) / 10,
	'gain': (v: number) => Math.round(v * 100) / 100
}

describe('Auto v8', () => {
	const commandParser = new CommandParser()

	for (let i = 0; i < DataV8.length; i++) {
		const testCase = DataV8[i]
		test(`Test #${i}: ${testCase.name}`, () => {
			// console.log(firstCase)

			const buffer = Buffer.from(testCase.bytes.replace(/-/g, ''), 'hex')
			const length = buffer.readUInt16BE(0)
			const name = buffer.toString('ascii', 4, 8)

			const cmd = commandParser.commandFromRawName(name)
			if (cmd && typeof cmd.deserialize === 'function') {
				cmd.deserialize(buffer.slice(0, length).slice(8))

				delete cmd.flag // Anything deserialized will never have flags
				delete cmd.rawName
				delete (cmd as any).rawCommand
				// console.log('ok', cmd)

				for (const key in cmd) {
					const newName = idAliases[key]
					if (cmd.hasOwnProperty(key) && newName) {
						cmd.properties[newName] = (cmd as any)[key]
					}
				}

				const lowerCommand: { [key: string]: any } = {}
				for (const key in testCase.command) {
					const newKey = key[0].toLowerCase() + key.substring(1)
					const newKey2 = propertyAliases[newKey] || newKey

					const converter = propertyConversion[newKey]
					const newValue = converter ? converter(testCase.command[key]) : testCase.command[key]
					lowerCommand[newKey2] = newValue
				}

				expect(cmd.properties).toEqual(lowerCommand)
			} else {
				// TODO command might be a setter and so serializable
				console.log('command is not deserializable')

				// Otherwise ignore, as its not supported
				// expect(false).toBeTruthy()
			}
		})
	}
})
