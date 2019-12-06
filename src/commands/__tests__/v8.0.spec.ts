import { CommandParser } from '../../lib/atemCommandParser'
import { TestCase, runTestForCommand, CommandTestConverterSet, ensureAllCommandsCovered } from './util'
import { ProtocolVersion } from '../../enums'

const TestCases = require('./data-v8.0.json') as TestCase[]

const commandConverters: CommandTestConverterSet = {
	'AMIP': {
		idAliases: {
			'index': 'index'
		},
		propertyAliases: {
			'balance': (v: number) => ({ val: Math.round(v) }),
			'gain': (v: number) => ({ val: Math.round(v * 100) / 100 })
		}
	},
	'_SSC': {
		idAliases: {
			'ssrcId': 'sSrcId'
		},
		propertyAliases: {
			'boxes': (val: any) => ({ val, name: 'boxCount' })
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
			'videoSources': (val: any) => ({ val, name: 'sources' }),
			'superSource': (val: any) => ({ val, name: 'superSources' })
		}
	},
	'SSrc': {
		idAliases: {
			'ssrcId': 'sSrcId'
		},
		propertyAliases: {
			'artClip': (v: number) => ({ val: Math.round(v * 10) }),
			'artGain': (v: number) => ({ val: Math.round(v * 10) }),
			'artFillInput': (v: number) => ({ val: v, name: 'artFillSource' }),
			'artKeyInput': (v: number) => ({ val: v, name: 'artCutSource' })
		}
	},
	'CSSc': {
		idAliases: {
			'ssrcId': 'sSrcId'
		},
		propertyAliases: {
			'artClip': (v: number) => ({ val: Math.round(v * 10) }),
			'artGain': (v: number) => ({ val: Math.round(v * 10) })
		}
	},
	'SSBd': {
		idAliases: {
			'ssrcId': 'sSrcId'
		},
		propertyAliases: {
			'borderLightSourceAltitude': (v: number) => ({ val: Math.round(v) }),
			'borderLightSourceDirection': (v: number) => ({ val: Math.round(v * 10) }),
			'borderHue': (v: number) => ({ val: Math.round(v * 10) }),
			'borderWidthIn': (v: number) => ({ val: Math.round(v * 100), name: 'borderInnerWidth' }),
			'borderLuma': (v: number) => ({ val: Math.round(v * 10) }),
			'borderWidthOut': (v: number) => ({ val: Math.round(v * 100), name: 'borderOuterWidth' }),
			'borderSaturation': (v: number) => ({ val: Math.round(v * 10) }),
			'borderSoftnessIn': (v: number) => ({ val: v, name: 'borderInnerSoftness' }),
			'borderSoftnessOut': (v: number) => ({ val: v, name: 'borderOuterSoftness' })
		}
	},
	'CSBd': {
		idAliases: {
			'ssrcId': 'sSrcId'
		},
		propertyAliases: {
			'borderLightSourceAltitude': (v: number) => ({ val: Math.round(v) }),
			'borderLightSourceDirection': (v: number) => ({ val: Math.round(v * 10) }),
			'borderHue': (v: number) => ({ val: Math.round(v * 10) }),
			'borderInnerWidth': (v: number) => ({ val: Math.round(v * 100) }),
			'borderLuma': (v: number) => ({ val: Math.round(v * 10) }),
			'borderOuterWidth': (v: number) => ({ val: Math.round(v * 100) }),
			'borderSaturation': (v: number) => ({ val: Math.round(v * 10) })
		}
	},
	'SSBP': {
		idAliases: {
			'ssrcId': 'sSrcId',
			'boxId': 'boxIndex'
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
	'CSBP': {
		idAliases: {
			'ssrcId': 'sSrcId',
			'boxId': 'boxIndex'
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
	}
}

describe('Commands v8.0', () => {
	const commandParser = new CommandParser()
	commandParser.version = ProtocolVersion.V8_0

	ensureAllCommandsCovered(commandParser, TestCases)

	for (let i = 0; i < TestCases.length; i++) {
		const testCase = TestCases[i]
		// console.log(testCase)

		switch (testCase.name) {
			// Not parsed
			case '_MvC': // Not parsed
			case 'AMIP': // portType max value
				continue
		}

		runTestForCommand(commandParser, commandConverters, i, testCase)
	}
})
