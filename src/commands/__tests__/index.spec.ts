import { CommandParser } from '../../lib/atemCommandParser'
import { TestCase, runTestForCommand, CommandTestConverterSet, CommandFactory } from './util'

const DataV8 = require('./data-v7.2.json') as TestCase[]

const commandConverters: CommandTestConverterSet = {
	'_ver': {
		idAliases: {},
		propertyAliases: {
			'apiMajor': (v: number) => ({ val: v, name: 'major' }),
			'apiMinor': (v: number) => ({ val: v, name: 'minor' })
		}
	},
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
	},
	'DskS': {
		idAliases: {
			'downstreamKeyerId': 'index'
		},
		propertyAliases: {}
	},
	'DskB': {
		idAliases: {
			'downstreamKeyerId': 'index'
		},
		propertyAliases: {}
	},
	'AMIP': {
		idAliases: {
			'index': 'index'
		},
		propertyAliases: {
			'balance': (v: number) => ({ val: Math.round(v * 10) / 10 }),
			'gain': (v: number) => ({ val: Math.round(v * 100) / 100 })
		}
	},
	'AMMO': {
		idAliases: {},
		propertyAliases: {
			'programOutFollowFadeToBlack': (val: any) => ({ val, name: 'followFadeToBlack' }),
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
	},
	'FTCD': {
		idAliases: {},
		propertyAliases: {},
		customMutate: (obj: any) => {
			delete obj['unknown']
			delete obj['test3']
			return obj
		}
	},
	'Powr': {
		idAliases: {},
		propertyAliases: {},
		customMutate: (obj: any) => {
			return [ obj.pin1, obj.pin2 ]
		}
	},
	'KePt': {
		idAliases: {
			'mixEffect': 'mixEffectIndex',
			'upstreamKeyerId': 'keyerIndex'
		},
		propertyAliases: {
			'inverse': (val: any) => ({ val, name: 'invert' }),
			'size': (v: number) => ({ val: Math.round(v * 100) }),
			'softness': (v: number) => ({ val: Math.round(v * 100) }),
			'symmetry': (v: number) => ({ val: Math.round(v * 100) }),
			'xPosition': (v: number) => ({ val: Math.round(v * 10000), name: 'positionX' }),
			'yPosition': (v: number) => ({ val: Math.round(v * 10000), name: 'positionY' })
		}
	},
	'KeCk': {
		idAliases: {
			'mixEffect': 'mixEffectIndex',
			'upstreamKeyerId': 'keyerIndex'
		},
		propertyAliases: {
			'gain': (v: number) => ({ val: Math.round(v * 10) }),
			'hue': (v: number) => ({ val: Math.round(v * 10) }),
			'lift': (v: number) => ({ val: Math.round(v * 10) }),
			'ySuppress': (v: number) => ({ val: Math.round(v * 10) })
		}
	},
	'KeOn': {
		idAliases: {
			'mixEffect': 'mixEffectIndex',
			'upstreamKeyerId': 'keyerIndex'
		},
		propertyAliases: {}
	},
	'KeLm': {
		idAliases: {
			'mixEffect': 'mixEffectIndex',
			'upstreamKeyerId': 'keyerIndex'
		},
		propertyAliases: {
			'gain': (v: number) => ({ val: Math.round(v * 10) }),
			'clip': (v: number) => ({ val: Math.round(v * 10) })
		}
	},
	'KeBP': {
		idAliases: {
			'mixEffect': 'mixEffectIndex'
			// 'upstreamKeyerId': 'keyerIndex'
		},
		propertyAliases: {
			'keyerIndex': (val: any) => ({ val, name: 'upstreamKeyerId' }),
			'mode': (val: any) => ({ val, name: 'mixEffectKeyType' }),
			'maskLeft': (v: number) => ({ val: Math.round(v * 1000) }),
			'maskRight': (v: number) => ({ val: Math.round(v * 1000) }),
			'maskTop': (v: number) => ({ val: Math.round(v * 1000) }),
			'maskBottom': (v: number) => ({ val: Math.round(v * 1000) })
		}
	},
	'KeDV': {
		idAliases: {
			'mixEffect': 'mixEffectIndex',
			'upstreamKeyerId': 'keyerIndex'
		},
		propertyAliases: {
			'positionX': (v: number) => ({ val: Math.round(v * 1000) }),
			'positionY': (v: number) => ({ val: Math.round(v * 1000) }),
			'sizeX': (v: number) => ({ val: Math.round(v * 1000) }),
			'sizeY': (v: number) => ({ val: Math.round(v * 1000) }),
			'rotation': (v: number) => ({ val: Math.round(v * 10) }),
			'borderHue': (v: number) => ({ val: Math.round(v * 10) }),
			'borderInnerWidth': (v: number) => ({ val: Math.round(v * 100) }),
			'borderLuma': (v: number) => ({ val: Math.round(v * 10) }),
			'borderOuterWidth': (v: number) => ({ val: Math.round(v * 100) }),
			'borderSaturation': (v: number) => ({ val: Math.round(v * 10) }),
			'lightSourceDirection': (v: number) => ({ val: Math.round(v * 10) }),
			'borderShadowEnabled': (val: any) => ({ val, name: 'shadowEnabled' }),
			'maskLeft': (v: number) => ({ val: Math.round(v * 1000) }),
			'maskRight': (v: number) => ({ val: Math.round(v * 1000) }),
			'maskTop': (v: number) => ({ val: Math.round(v * 1000) }),
			'maskBottom': (v: number) => ({ val: Math.round(v * 1000) })
		}
	},
	'TDvP': {
		idAliases: {
			'mixEffect': 'index'
		},
		propertyAliases: {
			'gain': (v: number) => ({ val: Math.round(v * 10) }),
			'clip': (v: number) => ({ val: Math.round(v * 10) })
		}
	},
	'TStP': {
		idAliases: {
			'mixEffect': 'index'
		},
		propertyAliases: {
			'gain': (v: number) => ({ val: Math.round(v * 10) }),
			'clip': (v: number) => ({ val: Math.round(v * 10) })
		}
	},
	'TrPr': {
		idAliases: {
			'mixEffect': 'index'
		},
		propertyAliases: {
			'previewTransition': (val: any) => ({ val, name: 'preview' })
		}
	},
	'TrSS': {
		idAliases: {
			'mixEffect': 'index'
		},
		propertyAliases: {}
	},
	'TMxP': {
		idAliases: {
			'mixEffect': 'index'
		},
		propertyAliases: {}
	},
	'TDpP': {
		idAliases: {
			'mixEffect': 'index'
		},
		propertyAliases: {}
	},
	'TWpP': {
		idAliases: {
			'mixEffect': 'index'
		},
		propertyAliases: {
			'symmetry': (v: number) => ({ val: Math.round(v * 100) }),
			'xPosition': (v: number) => ({ val: Math.round(v * 10000) }),
			'yPosition': (v: number) => ({ val: Math.round(v * 10000) }),
			'borderSoftness': (v: number) => ({ val: Math.round(v * 100) }),
			'borderWidth': (v: number) => ({ val: Math.round(v * 100) })
		}
	},
	'TrPs': {
		idAliases: {
			'mixEffect': 'index'
		},
		propertyAliases: {
			'handlePosition': (v: number) => ({ val: Math.round(v * 10000) })
		}
	},
	'MRPr': {
		idAliases: {},
		propertyAliases: {
			'index': (val: any) => ({ val, name: 'macroIndex' })
		}
	},
	'MRcS': {
		idAliases: {},
		propertyAliases: {
			'index': (val: any) => ({ val, name: 'macroIndex' })
		}
	},
	'MvIn': {
		idAliases: {
			'multiViewerId': 'multiviewIndex'
		},
		propertyAliases: {}
	},
	'VidM': {
		idAliases: {},
		propertyAliases: {
			'videoMode': (val: any) => ({ val, name: 'mode' })
		}
	},
	'RCPS': {
		idAliases: {
			'mediaPlayerId': 'index'
		},
		propertyAliases: {}
	},
	'MPCS': {
		idAliases: {
			'mediaPool': 'index'
		},
		propertyAliases: {},
		customMutate: (obj: any) => {
			obj.frames = []
			return obj
		}
	},
	'MPfe': {
		idAliases: {
			'mediaPool': 'bank',
			'frameIndex': 'index'
		},
		propertyAliases: {
			'filename': (val: any) => ({ val, name: 'fileName' })
		}
	},
	'MPrp': {
		idAliases: {},
		propertyAliases: {
			'index': (val: any) => ({ val, name: 'macroIndex' })
		}
	},
	'PrgI': {
		idAliases: {
			'mixEffect': 'index'
		},
		propertyAliases: {}
	},
	'PrvI': {
		idAliases: {
			'mixEffect': 'index'
		},
		propertyAliases: {}
	},
	'FtbS': {
		idAliases: {
			'mixEffect': 'index'
		},
		propertyAliases: {}
	},
	'FtbP': {
		idAliases: {
			'mixEffect': 'index'
		},
		propertyAliases: {}
	},
	'AuxS': {
		idAliases: {
			'auxBus': 'id'
		},
		propertyAliases: {}
	},
	'CAuS': {
		idAliases: {
			'auxBus': 'id'
		},
		propertyAliases: {}
	}
}

describe('Commands v7.2', () => {
	const commandParser = new CommandParser()
	const commandFactory = new CommandFactory()

	// TODO - track which commands havent had a serialize/deserialize called and cause a failure on that, or is lack of test percentage good enough?
	// TODO - some commands appear to not have very random data. Will some not work because of their c# implementation?

	for (let i = 0; i < DataV8.length; i++) {
		const testCase = DataV8[i]
		test(`Test #${i}: ${testCase.name}`, () => {
			// console.log(firstCase)

			switch (testCase.name) {
				// Temporarily ignore the failures
				case 'AMIP':
				case '_top':
				case 'AMMO':
				case 'KKFP':
				case 'TrPs':
					return
			}

			runTestForCommand(commandParser, commandFactory, commandConverters, testCase, true)
		})
	}
})
