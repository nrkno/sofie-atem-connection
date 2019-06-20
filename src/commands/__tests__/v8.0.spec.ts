import { CommandParser } from '../../lib/atemCommandParser'
import { TestCase, runTestForCommand, CommandTestConverterSet } from './util'

const DataV8 = require('./data-v8.0.json') as TestCase[]

// const idAliases: { [key: string]: string } = {
// 	// 'auxBus': 'id',
// 	'index': 'index',
// 	// 'mixEffect': 'index',
// 	// // 'mixEffectIndex': 'index',
// 	// 'multiViewerId': 'index',
// 	// 'upstreamKeyerId': 'keyerIndex',
// 	// 'mediaPlayerId': 'index',
// 	// 'downstreamKeyerId': 'index',
// 	// 'mediaPool': 'bank',
// 	// 'frameIndex': 'index'
// }
// const propertyAliases: { [key: string]: string } = { // TODO - should these be done in the generator instead
// 	// 'programOutFollowFadeToBlack': 'followFadeToBlack',
// 	// 'mixEffectIndex': 'index',
// 	// 'apiMajor': 'major',
// 	// 'apiMinor': 'minor',
// 	'dVE': 'DVEs',
// 	'mixEffectBlocks': 'MEs',
// 	'auxiliaries': 'auxilliaries',
// 	'serialPort': 'serialPorts',
// 	'hyperDecks': 'maxHyperdecks',
// 	'videoSources': 'sources',
// 	// 'previewTransition': 'preview',
// 	// 'videoMode': 'mode',
// 	// 'multiviewIndex': 'index',
// 	// 'KeBP.keyerIndex': 'upstreamKeyerId',
// 	// 'KeBP.mode': 'mixEffectKeyType',
// 	// 'KePt.xPosition': 'positionX',
// 	// 'KePt.yPosition': 'positionY',
// 	// 'MRPr.index': 'macroIndex',
// 	// 'MRcS.index': 'macroIndex',
// 	// 'MPrp.index': 'macroIndex',
// 	// 'filename': 'fileName',
// 	// 'DskP.preMultipliedKey': 'preMultiply',
// 	// 'inverse': 'invert',
// 	// 'borderShadowEnabled': 'shadowEnabled'
// }
// const propertyConversion: { [key: string]: (v: any) => any } = { // TODO - should these be done in the generator instead?
// 	'balance': (v: number) => Math.round(v * 10) / 10,
// 	'gain': (v: number) => Math.round(v * 100) / 100,
// 	// 'TStP.gain': (v: number) => Math.round(v * 10),
// 	// 'TStP.clip': (v: number) => Math.round(v * 10),
// 	// 'borderSoftness': (v: number) => Math.round(v * 100),
// 	// 'borderWidth': (v: number) => Math.round(v * 100),
// 	// 'symmetry': (v: number) => Math.round(v * 100),
// 	// 'xPosition': (v: number) => Math.round(v * 10000),
// 	// 'yPosition': (v: number) => Math.round(v * 10000),
// 	// 'TDvP.gain': (v: number) => Math.round(v * 10),
// 	// 'TDvP.clip': (v: number) => Math.round(v * 10),
// 	// 'KeCk.gain': (v: number) => Math.round(v * 10),
// 	// 'hue': (v: number) => Math.round(v * 10),
// 	// 'lift': (v: number) => Math.round(v * 10),
// 	// 'ySuppress': (v: number) => Math.round(v * 10),
// 	// 'maskLeft': (v: number) => Math.round(v * 1000),
// 	// 'maskRight': (v: number) => Math.round(v * 1000),
// 	// 'maskTop': (v: number) => Math.round(v * 1000),
// 	// 'maskBottom': (v: number) => Math.round(v * 1000),
// 	// 'KeLm.clip': (v: number) => Math.round(v * 10),
// 	// 'KeLm.gain': (v: number) => Math.round(v * 10),
// 	// 'handlePosition': (v: number) => Math.round(v * 10000),
// 	// 'hash': (v: string) => Buffer.from(v, 'base64').toString('ascii'),
// 	// 'DskP.clip': (v: number) => Math.round(v * 10),
// 	// 'DskP.gain': (v: number) => Math.round(v * 10),
// 	// 'size': (v: number) => Math.round(v * 100),
// 	// 'softness': (v: number) => Math.round(v * 100),
// 	// 'borderHue': (v: number) => Math.round(v * 10),
// 	// 'borderInnerWidth': (v: number) => Math.round(v * 100),
// 	// 'borderLuma': (v: number) => Math.round(v * 10),
// 	// 'borderOuterWidth': (v: number) => Math.round(v * 100),
// 	// 'borderSaturation': (v: number) => Math.round(v * 10),
// 	// 'lightSourceDirection': (v: number) => Math.round(v * 10),
// 	// 'KeDV.positionX': (v: number) => Math.round(v * 1000),
// 	// 'KeDV.positionY': (v: number) => Math.round(v * 1000),
// 	// 'KeDV.sizeX': (v: number) => Math.round(v * 1000),
// 	// 'KeDV.sizeY': (v: number) => Math.round(v * 1000),
// 	// 'KeDV.rotation': (v: number) => Math.round(v * 10)
// }

const commandConverters: CommandTestConverterSet = {
	'AMIP': {
		idAliases: {
			'index': 'index'
		},
		propertyAliases: {
			'balance': (v: number) => ({ val: Math.round(v * 10) / 10 }),
			'gain': (v: number) => ({ val: Math.round(v * 100) / 100 })
		}
	},
	'_top': {
		idAliases: {},
		propertyAliases: {
			'auxiliaries': (val: any) => ({ val, name: 'auxilliaries' }),
			'dVE': (val: any) => ({ val, name: 'DVEs' }),
			'hyperDecks': (val: any) => ({ val, name: 'maxHyperdecks' }),
			'mixEffectBlocks': (val: any) => ({ val, name: 'MEs' }),
			'serialPort': (val: any) => ({ val, name: 'serialPorts' }),
			'videoSources': (val: any) => ({ val, name: 'sources' })
		}
	}
}

describe('Commands v8.0', () => {
	const commandParser = new CommandParser()

	// TODO - track which commands havent had a serialize/deserialize called and cause a failure on that, or is lack of test percentage good enough?
	// TODO - some commands appear to not have very random data. Will some not work because of their c# implementation?

	for (let i = 0; i < DataV8.length; i++) {
		const testCase = DataV8[i]
		test(`Test #${i}: ${testCase.name}`, () => {
			// console.log(testCase)

			switch (testCase.name) {
				case '_MvC':
					return
			}

			runTestForCommand(commandParser, commandConverters, testCase)
		})
	}
})
