import { CommandParser } from '../../lib/atemCommandParser'

const DataV8 = require('./data-v7.2.json') as TestCase[]

export interface TestCase {
	name: string
	bytes: string
	command: { [key: string]: any }
}

export interface CommandTestConverter {
	idAliases: { [key: string]: string }
	propertyAliases: { [key: string]: (v: any) => { name?: string, val: any } }
	customMutate?: (v: any) => any
}

const idAliases: { [key: string]: string } = {
	'auxBus': 'id',
	'index': 'index',
	'mixEffect': 'index',
	// 'mixEffectIndex': 'index',
	'multiViewerId': 'index',
	'upstreamKeyerId': 'keyerIndex',
	'mediaPlayerId': 'index',
	'downstreamKeyerId': 'index',
	'mediaPool': 'bank',
	'frameIndex': 'index'
}
const propertyAliases: { [key: string]: string } = { // TODO - should these be done in the generator instead
	'programOutFollowFadeToBlack': 'followFadeToBlack',
	'mixEffectIndex': 'index',
	'apiMajor': 'major',
	'apiMinor': 'minor',
	'dVE': 'DVEs',
	'mixEffectBlocks': 'MEs',
	'auxiliaries': 'auxilliaries',
	'serialPort': 'serialPorts',
	'hyperDecks': 'maxHyperdecks',
	'videoSources': 'sources',
	'previewTransition': 'preview',
	'videoMode': 'mode',
	'multiviewIndex': 'index',
	'KeBP.keyerIndex': 'upstreamKeyerId',
	'KeBP.mode': 'mixEffectKeyType',
	'KePt.xPosition': 'positionX',
	'KePt.yPosition': 'positionY',
	'MRPr.index': 'macroIndex',
	'MRcS.index': 'macroIndex',
	'MPrp.index': 'macroIndex',
	'filename': 'fileName',
	'DskP.preMultipliedKey': 'preMultiply',
	'inverse': 'invert',
	'borderShadowEnabled': 'shadowEnabled',
	'inputSource': 'source',
	'artFillInput': 'artFillSource',
	'artKeyInput': 'artCutSource',
	'borderSoftnessIn': 'borderInnerSoftness',
	'borderSoftnessOut': 'borderOuterSoftness',
	'borderWidthIn': 'borderInnerWidth',
	'borderWidthOut': 'borderOuterWidth'
}
const propertyConversion: { [key: string]: (v: any) => any } = { // TODO - should these be done in the generator instead?
	'balance': (v: number) => Math.round(v * 10) / 10,
	'gain': (v: number) => Math.round(v * 100) / 100,
	'TStP.gain': (v: number) => Math.round(v * 10),
	'TStP.clip': (v: number) => Math.round(v * 10),
	'borderSoftness': (v: number) => Math.round(v * 100),
	'borderWidth': (v: number) => Math.round(v * 100),
	'symmetry': (v: number) => Math.round(v * 100),
	'xPosition': (v: number) => Math.round(v * 10000),
	'yPosition': (v: number) => Math.round(v * 10000),
	'TDvP.gain': (v: number) => Math.round(v * 10),
	'TDvP.clip': (v: number) => Math.round(v * 10),
	'KeCk.gain': (v: number) => Math.round(v * 10),
	'hue': (v: number) => Math.round(v * 10),
	'lift': (v: number) => Math.round(v * 10),
	'ySuppress': (v: number) => Math.round(v * 10),
	'maskLeft': (v: number) => Math.round(v * 1000),
	'maskRight': (v: number) => Math.round(v * 1000),
	'maskTop': (v: number) => Math.round(v * 1000),
	'maskBottom': (v: number) => Math.round(v * 1000),
	'KeLm.clip': (v: number) => Math.round(v * 10),
	'KeLm.gain': (v: number) => Math.round(v * 10),
	'handlePosition': (v: number) => Math.round(v * 10000),
	'hash': (v: string) => Buffer.from(v, 'base64').toString('ascii'),
	'size': (v: number) => Math.round(v * 100),
	'softness': (v: number) => Math.round(v * 100),
	// 'borderHue': (v: number) => Math.round(v * 10),
	// 'borderInnerWidth': (v: number) => Math.round(v * 100),
	// 'borderLuma': (v: number) => Math.round(v * 10),
	// 'borderOuterWidth': (v: number) => Math.round(v * 100),
	// 'borderSaturation': (v: number) => Math.round(v * 10),
	'lightSourceDirection': (v: number) => Math.round(v * 10),
	'KeDV.positionX': (v: number) => Math.round(v * 1000),
	'KeDV.positionY': (v: number) => Math.round(v * 1000),
	'KeDV.sizeX': (v: number) => Math.round(v * 1000),
	'KeDV.sizeY': (v: number) => Math.round(v * 1000),
	'KeDV.rotation': (v: number) => Math.round(v * 10),
	'cropBottom': (v: number) => Math.round(v * 1000),
	'cropTop': (v: number) => Math.round(v * 1000),
	'cropLeft': (v: number) => Math.round(v * 1000),
	'cropRight': (v: number) => Math.round(v * 1000)
	// 'SSrc.borderInnerWidth': (v: number) => Math.round(v * 100),
	// 'SSrc.borderOuterWidth': (v: number) => Math.round(v * 200),
}

const propAliases2: CommandTestConverter['propertyAliases'] = {}

for (const id of Object.keys(propertyAliases)) {
	propAliases2[id] = (v: any) => ({ val: v, name: propertyAliases[id] })
}
for (const id of Object.keys(propertyConversion)) {
	const conv = propertyConversion[id]
	const alias = propAliases2[id]
	if (alias) {
		const newId = alias(null).name
		propAliases2[id] = (v: any) => ({ val: conv(v), name: newId })
	} else {
		propAliases2[id] = (v: any) => ({ val: conv(v) })
	}
}

const defaultConverter: CommandTestConverter = {
	// TODO - replace this with the specific converters
	idAliases,
	propertyAliases: propAliases2
}

const commandConverters: { [key: string]: CommandTestConverter } = {
	'SSBP': {
		idAliases: {
			'boxId': 'index'
		},
		propertyAliases: {
			'cropBottom': (v: number) => ({ val: Math.round(v * 1000) }),
			'cropTop': (v: number) => ({ val: Math.round(v * 1000) }),
			'cropLeft': (v: number) => ({ val: Math.round(v * 1000) }),
			'cropRight': (v: number) => ({ val: Math.round(v * 1000) }),
			'size': (v: number) => ({ val: Math.round(v * 1000) }),
			'positionX': (v: number) => ({ val: Math.round(v * 100), name: 'x' }),
			'positionY': (v: number) => ({ val: Math.round(v * 100), name: 'y' }),
			'inputSource': (v: number) => ({ val: v, name: 'source' })
		}
	},
	'SSrc': {
		idAliases: {},
		propertyAliases: {
			'artClip': (v: number) => ({ val: Math.round(v * 10) }),
			'artGain': (v: number) => ({ val: Math.round(v * 10) }),
			'borderLightSourceAltitude': (v: number) => ({ val: Math.round(v) }),
			'borderLightSourceDirection': (v: number) => ({ val: Math.round(v * 10) }),
			'borderHue': (v: number) => ({ val: Math.round(v * 10) }),
			'borderWidthIn': (v: number) => ({ val: Math.round(v * 100), name: 'borderInnerWidth' }),
			'borderLuma': (v: number) => ({ val: Math.round(v * 10) }),
			'borderWidthOut': (v: number) => ({ val: Math.round(v * 100), name: 'borderOuterWidth' }),
			'borderSaturation': (v: number) => ({ val: Math.round(v * 10) }),
			'borderSoftnessIn': (v: number) => ({ val: v, name: 'borderInnerSoftness' }),
			'borderSoftnessOut': (v: number) => ({ val: v, name: 'borderOuterSoftness' }),
			'artFillInput': (v: number) => ({ val: v, name: 'artFillSource' }),
			'artKeyInput': (v: number) => ({ val: v, name: 'artCutSource' })
		}
	},
	'DskP': {
		idAliases: {
			'downstreamKeyerId': 'index'
		},
		propertyAliases: {
			'clip': (v: number) => ({ val: Math.round(v * 10) }),
			'gain': (v: number) => ({ val: Math.round(v * 10) }),
			'preMultipliedKey': (v: number) => ({ val: v, name: 'preMultiply' }),
			'maskLeft': (v: number) => ({ val: Math.round(v * 1000) }),
			'maskRight': (v: number) => ({ val: Math.round(v * 1000) }),
			'maskTop': (v: number) => ({ val: Math.round(v * 1000) }),
			'maskBottom': (v: number) => ({ val: Math.round(v * 1000) })
		},
		customMutate: (obj: any) => {
			obj['mask'] = {
				enabled: obj['maskEnabled'],
				top: obj['maskTop'],
				bottom: obj['maskBottom'],
				left: obj['maskLeft'],
				right: obj['maskRight']
			}
			delete obj['maskEnabled']
			delete obj['maskTop']
			delete obj['maskBottom']
			delete obj['maskLeft']
			delete obj['maskRight']
			return obj
		}
	}
}

describe('Commands v7.2', () => {
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

				const converter = commandConverters[name] || defaultConverter

				for (const key in cmd) {
					const newName = converter.idAliases[key]
					if (cmd.hasOwnProperty(key) && newName) {
						if (!cmd.properties) cmd.properties = {}
						cmd.properties[newName] = (cmd as any)[key]
					}
				}

				let lowerCommand: { [key: string]: any } = {}
				for (const key in testCase.command) {
					const newKey = key[0].toLowerCase() + key.substring(1)
					const propConv = converter.propertyAliases[`${name}.${newKey}`] || converter.propertyAliases[newKey]
					const newProp = propConv ? propConv(testCase.command[key]) : { val: testCase.command[key] }

					lowerCommand[newProp.name || newKey] = newProp.val
				}

				// delete lowerCommand['test1']
				// delete lowerCommand['test2']
				// delete lowerCommand['test3']
				// delete lowerCommand['unknown']

				if (converter.customMutate) {
					lowerCommand = converter.customMutate(lowerCommand)
				}

				expect(cmd.properties).toEqual(lowerCommand)
			} else {
				// TODO command might be a setter and so serializable
				// console.log('command is not deserializable')

				// Otherwise ignore, as its not supported
				// TODO - should they be ignored in here, or filtered in the generator project?
				// expect(false).toBeTruthy()
			}
		})
	}
})
