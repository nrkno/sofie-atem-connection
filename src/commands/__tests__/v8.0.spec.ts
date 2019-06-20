import { CommandParser } from '../../lib/atemCommandParser'

const DataV8 = require('./data-v8.0.json') as TestCase[]

export interface TestCase {
	name: string
	bytes: string
	command: { [key: string]: any }
}

const idAliases: { [key: string]: string } = {
	// 'auxBus': 'id',
	'index': 'index',
	// 'mixEffect': 'index',
	// // 'mixEffectIndex': 'index',
	// 'multiViewerId': 'index',
	// 'upstreamKeyerId': 'keyerIndex',
	// 'mediaPlayerId': 'index',
	// 'downstreamKeyerId': 'index',
	// 'mediaPool': 'bank',
	// 'frameIndex': 'index'
}
const propertyAliases: { [key: string]: string } = { // TODO - should these be done in the generator instead
	// 'programOutFollowFadeToBlack': 'followFadeToBlack',
	// 'mixEffectIndex': 'index',
	// 'apiMajor': 'major',
	// 'apiMinor': 'minor',
	'dVE': 'DVEs',
	'mixEffectBlocks': 'MEs',
	'auxiliaries': 'auxilliaries',
	'serialPort': 'serialPorts',
	'hyperDecks': 'maxHyperdecks',
	'videoSources': 'sources',
	// 'previewTransition': 'preview',
	// 'videoMode': 'mode',
	// 'multiviewIndex': 'index',
	// 'KeBP.keyerIndex': 'upstreamKeyerId',
	// 'KeBP.mode': 'mixEffectKeyType',
	// 'KePt.xPosition': 'positionX',
	// 'KePt.yPosition': 'positionY',
	// 'MRPr.index': 'macroIndex',
	// 'MRcS.index': 'macroIndex',
	// 'MPrp.index': 'macroIndex',
	// 'filename': 'fileName',
	// 'DskP.preMultipliedKey': 'preMultiply',
	// 'inverse': 'invert',
	// 'borderShadowEnabled': 'shadowEnabled'
}
const propertyConversion: { [key: string]: (v: any) => any } = { // TODO - should these be done in the generator instead?
	'balance': (v: number) => Math.round(v * 10) / 10,
	'gain': (v: number) => Math.round(v * 100) / 100,
	// 'TStP.gain': (v: number) => Math.round(v * 10),
	// 'TStP.clip': (v: number) => Math.round(v * 10),
	// 'borderSoftness': (v: number) => Math.round(v * 100),
	// 'borderWidth': (v: number) => Math.round(v * 100),
	// 'symmetry': (v: number) => Math.round(v * 100),
	// 'xPosition': (v: number) => Math.round(v * 10000),
	// 'yPosition': (v: number) => Math.round(v * 10000),
	// 'TDvP.gain': (v: number) => Math.round(v * 10),
	// 'TDvP.clip': (v: number) => Math.round(v * 10),
	// 'KeCk.gain': (v: number) => Math.round(v * 10),
	// 'hue': (v: number) => Math.round(v * 10),
	// 'lift': (v: number) => Math.round(v * 10),
	// 'ySuppress': (v: number) => Math.round(v * 10),
	// 'maskLeft': (v: number) => Math.round(v * 1000),
	// 'maskRight': (v: number) => Math.round(v * 1000),
	// 'maskTop': (v: number) => Math.round(v * 1000),
	// 'maskBottom': (v: number) => Math.round(v * 1000),
	// 'KeLm.clip': (v: number) => Math.round(v * 10),
	// 'KeLm.gain': (v: number) => Math.round(v * 10),
	// 'handlePosition': (v: number) => Math.round(v * 10000),
	// 'hash': (v: string) => Buffer.from(v, 'base64').toString('ascii'),
	// 'DskP.clip': (v: number) => Math.round(v * 10),
	// 'DskP.gain': (v: number) => Math.round(v * 10),
	// 'size': (v: number) => Math.round(v * 100),
	// 'softness': (v: number) => Math.round(v * 100),
	// 'borderHue': (v: number) => Math.round(v * 10),
	// 'borderInnerWidth': (v: number) => Math.round(v * 100),
	// 'borderLuma': (v: number) => Math.round(v * 10),
	// 'borderOuterWidth': (v: number) => Math.round(v * 100),
	// 'borderSaturation': (v: number) => Math.round(v * 10),
	// 'lightSourceDirection': (v: number) => Math.round(v * 10),
	// 'KeDV.positionX': (v: number) => Math.round(v * 1000),
	// 'KeDV.positionY': (v: number) => Math.round(v * 1000),
	// 'KeDV.sizeX': (v: number) => Math.round(v * 1000),
	// 'KeDV.sizeY': (v: number) => Math.round(v * 1000),
	// 'KeDV.rotation': (v: number) => Math.round(v * 10)
}

describe('Commands v8.0', () => {
	const commandParser = new CommandParser()

	// TODO - track which commands havent had a serialize/deserialize called and cause a failure on that, or is lack of test percentage good enough?
	// TODO - some commands appear to not have very random data. Will some not work because of their c# implementation?

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
						if (!cmd.properties) cmd.properties = {}
						cmd.properties[newName] = (cmd as any)[key]
					}
				}

				const lowerCommand: { [key: string]: any } = {}
				for (const key in testCase.command) {
					const newKey = key[0].toLowerCase() + key.substring(1)
					const newKey2 = propertyAliases[`${name}.${newKey}`] || propertyAliases[newKey] || newKey

					const converter = propertyConversion[`${name}.${newKey}`] || propertyConversion[newKey]
					const newValue = converter ? converter(testCase.command[key]) : testCase.command[key]
					lowerCommand[newKey2] = newValue
				}

				delete lowerCommand['test1']
				delete lowerCommand['test2']
				delete lowerCommand['test3']
				delete lowerCommand['unknown']

				expect(cmd.properties).toEqual(lowerCommand)
			} else {
				// TODO command might be a setter and so serializable
				// console.log('command is not deserializable')

				// These should all be supported, as they are a small list of changed commands
				expect(false).toBeTruthy()
			}
		})
	}
})
