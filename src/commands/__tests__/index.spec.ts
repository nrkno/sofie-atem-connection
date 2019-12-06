import { CommandParser } from '../../lib/atemCommandParser'
import { TestCase, runTestForCommand, CommandTestConverterSet, ensureAllCommandsCovered } from './util'
import { ProtocolVersion } from '../../enums'

const TestCases = require('./data-v7.2.json') as TestCase[]

const commandConverters: CommandTestConverterSet = {
	'_ver': {
		idAliases: {},
		propertyAliases: {
			'apiMajor': (v: number) => ({ val: v, name: 'major' }),
			'apiMinor': (v: number) => ({ val: v, name: 'minor' })
		},
		customMutate: (o: any) => {
			return {
				version: (o.major << 16) + o.minor
			}
		}
	},
	'_pin': {
		idAliases: {},
		propertyAliases: {
			'name': (val: any) => ({ val, name: 'productIdentifier' })
		}
	},
	'_SSC': {
		idAliases: {},
		propertyAliases: {
			'boxes': (val: any) => ({ val, name: 'boxCount' })
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
	'CSBP': {
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
		},
		customMutate: (o: any) => {
			return {
				properties: {
					artFillSource: o.artFillSource,
					artCutSource: o.artCutSource,
					artOption: o.artOption,
					artPreMultiplied: o.artPreMultiplied,
					artClip: o.artClip,
					artGain: o.artGain,
					artInvertKey: o.artInvertKey
				},
				border: {
					borderEnabled: o.borderEnabled,
					borderBevel: o.borderBevel,
					borderOuterWidth: o.borderOuterWidth,
					borderInnerWidth: o.borderInnerWidth,
					borderOuterSoftness: o.borderOuterSoftness,
					borderInnerSoftness: o.borderInnerSoftness,
					borderBevelSoftness: o.borderBevelSoftness,
					borderBevelPosition: o.borderBevelPosition,
					borderHue: o.borderHue,
					borderSaturation: o.borderSaturation,
					borderLuma: o.borderLuma,
					borderLightSourceDirection: o.borderLightSourceDirection,
					borderLightSourceAltitude: o.borderLightSourceAltitude
				}
			}
		}
	},
	'CSSc': {
		idAliases: {},
		propertyAliases: {
			'artClip': (v: number) => ({ val: Math.round(v * 10) }),
			'artGain': (v: number) => ({ val: Math.round(v * 10) }),
			'borderLightSourceAltitude': (v: number) => ({ val: Math.round(v) }),
			'borderLightSourceDirection': (v: number) => ({ val: Math.round(v * 10) }),
			'borderHue': (v: number) => ({ val: Math.round(v * 10) }),
			'borderInnerWidth': (v: number) => ({ val: Math.round(v * 100) }),
			'borderLuma': (v: number) => ({ val: Math.round(v * 10) }),
			'borderOuterWidth': (v: number) => ({ val: Math.round(v * 100) }),
			'borderSaturation': (v: number) => ({ val: Math.round(v * 10) })
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
	'CDsG': {
		idAliases: {
			'downstreamKeyerId': 'index'
		},
		propertyAliases: {
			'clip': (v: number) => ({ val: Math.round(v * 10) }),
			'gain': (v: number) => ({ val: Math.round(v * 10) }),
			'preMultipliedKey': (v: number) => ({ val: v, name: 'preMultiply' })
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
	'DDsA': {
		idAliases: {
			'downstreamKeyerId': 'index'
		},
		propertyAliases: {}
	},
	'CDsT': {
		idAliases: {
			'downstreamKeyerId': 'index'
		},
		propertyAliases: {}
	},
	'CDsR': {
		idAliases: {
			'downstreamKeyerId': 'index'
		},
		propertyAliases: {}
	},
	'CDsL': {
		idAliases: {
			'downstreamKeyerId': 'index'
		},
		propertyAliases: {}
	},
	'CDsC': {
		idAliases: {
			'downstreamKeyerId': 'index'
		},
		propertyAliases: {
			'source': (v: number) => ({ val: v, name: 'input' })
		}
	},
	'CDsF': {
		idAliases: {
			'downstreamKeyerId': 'index'
		},
		propertyAliases: {
			'source': (v: number) => ({ val: v, name: 'input' })
		}
	},
	'CDsM': {
		idAliases: {
			'downstreamKeyerId': 'index'
		},
		propertyAliases: {
			'maskEnabled': (val: any) => ({ val, name: 'enabled' }),
			'maskLeft': (v: number) => ({ val: Math.round(v * 1000), name: 'left' }),
			'maskRight': (v: number) => ({ val: Math.round(v * 1000), name: 'right' }),
			'maskTop': (v: number) => ({ val: Math.round(v * 1000), name: 'top' }),
			'maskBottom': (v: number) => ({ val: Math.round(v * 1000), name: 'bottom' })
		}
	},
	'AMIP': {
		idAliases: {
			'index': 'index'
		},
		propertyAliases: {
			'balance': (v: number) => ({ val: Math.round(v) }),
			'gain': (v: number) => ({ val: Math.round(v * 100) / 100 })
		},
		processDeserialized: props => {
			props.gain = Math.round(props.gain * 100) / 100
		}
	},
	'CAMI': {
		idAliases: {
			'index': 'index'
		},
		propertyAliases: {
			'balance': (v: number) => ({ val: Math.round(v * 200) / 200 })
			// 'gain': (v: number) => ({ val: Math.round(v * 100) / 100 })
		}
	},
	'AMMO': {
		idAliases: {},
		propertyAliases: {
			'programOutFollowFadeToBlack': (val: any) => ({ val, name: 'followFadeToBlack' }),
			'balance': (v: number) => ({ val: Math.round(v) }),
			'gain': (v: number) => ({ val: Math.round(v * 100) / 100 })
		}
	},
	'_top': {
		idAliases: {},
		propertyAliases: {
			'auxiliaries': (val: any) => ({ val, name: 'auxilliaries' }),
			'dVE': (val: any) => ({ val, name: 'DVEs' }),
			'hyperDecks': (val: any) => ({ val, name: 'maxHyperdecks' }),
			'mixEffectBlocks': (val: any) => ({ val, name: 'mixEffects' }),
			'serialPort': (val: any) => ({ val, name: 'serialPorts' }),
			'videoSources': (val: any) => ({ val, name: 'sources' }),
			'superSource': (val: any) => ({ val, name: 'superSources' }),
			'talkbackOverSDI': () => ({ val: 0 }) // @todo: should be fixed in atem-connection
		},
		customMutate: obj => {
			obj.downstreamKeyers = 2
			obj.multiViewers = 2
			obj.upstreamKeyers = 2
			return obj
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
	'FTFD': {
		idAliases: {},
		propertyAliases: {
			'filename': (val: any) => ({ val, name: 'fileName' })
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
			'pattern': (val: any) => ({ val, name: 'style' }),
			'inverse': (val: any) => ({ val, name: 'invert' }),
			'size': (v: number) => ({ val: Math.round(v * 100) }),
			'softness': (v: number) => ({ val: Math.round(v * 100) }),
			'symmetry': (v: number) => ({ val: Math.round(v * 100) }),
			'xPosition': (v: number) => ({ val: Math.round(v * 10000), name: 'positionX' }),
			'yPosition': (v: number) => ({ val: Math.round(v * 10000), name: 'positionY' })
		}
	},
	'CKPt': {
		idAliases: {
			'mixEffect': 'mixEffectIndex',
			'upstreamKeyerId': 'keyerIndex'
		},
		propertyAliases: {
			'pattern': (val: any) => ({ val, name: 'style' }),
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
	'CKCk': {
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
	'CKTp': {
		idAliases: {
			'mixEffect': 'mixEffectIndex',
			'upstreamKeyerId': 'keyerIndex'
		},
		propertyAliases: {
			'keyType': (v: number) => ({ val: v, name: 'mixEffectKeyType' })
		}
	},
	'KeOn': {
		idAliases: {
			'mixEffect': 'mixEffectIndex',
			'upstreamKeyerId': 'keyerIndex'
		},
		propertyAliases: {}
	},
	'CKOn': {
		idAliases: {
			'mixEffect': 'mixEffectIndex',
			'upstreamKeyerId': 'keyerIndex'
		},
		propertyAliases: {}
	},
	'CKeF': {
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
	'CKLm': {
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
	'CKDV': {
		idAliases: {
			'mixEffect': 'mixEffectIndex',
			'upstreamKeyerId': 'keyerIndex'
		},
		propertyAliases: {
			'positionX': (v: number) => ({ val: Math.round(v * 1000) }),
			'positionY': (v: number) => ({ val: Math.round(v * 1000) }),
			'sizeX': (v: number) => ({ val: Math.round(v * 1000) }),
			'sizeY': (v: number) => ({ val: Math.round(v * 1000) }),
			'rotation': (v: number) => ({ val: Math.round(v * 1000) }), // TODO - this doesnt match KeDV
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
	'CKeC': {
		idAliases: {
			'mixEffect': 'mixEffectIndex',
			'upstreamKeyerId': 'keyerIndex'
		},
		propertyAliases: {}
	},
	'CKMs': {
		idAliases: {
			'mixEffect': 'mixEffectIndex',
			'upstreamKeyerId': 'keyerIndex'
		},
		propertyAliases: {
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
	'CTDv': {
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
	'CTSt': {
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
	'CTPr': {
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
	'CTTp': {
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
	'CTMx': {
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
	'CTDp': {
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
	'CTWp': {
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
	'CTPs': {
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
	'CMvI': {
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
	'CVdM': {
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
	'SCPS': {
		idAliases: {
			'mediaPlayerId': 'index'
		},
		propertyAliases: {}
	},
	'MPCS': {
		idAliases: {
			'clipId': 'index'
		},
		propertyAliases: {}
	},
	'SMPC': {
		idAliases: {
			// 'mediaPool': 'index'
		},
		propertyAliases: {}
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
	'CPgI': {
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
	'CPvI': {
		idAliases: {
			'mixEffect': 'index'
		},
		propertyAliases: {}
	},
	'DCut': {
		idAliases: {
			'mixEffect': 'index'
		},
		propertyAliases: {}
	},
	'DAut': {
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
	'FtbC': {
		idAliases: {
			'mixEffect': 'index'
		},
		propertyAliases: {}
	},
	'FtbA': {
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
	},
	'CInL': {
		idAliases: {
			'inputId': 'id'
		},
		propertyAliases: {}
	},
	'MAct': {
		idAliases: {
			'index': 'index'
		},
		propertyAliases: {}
	},
	'FTDa': {
		idAliases: {},
		propertyAliases: {
			'body': (v: string) => ({ val: Buffer.from(v, 'base64') })
		},
		customMutate: (obj: any) => {
			obj.size = obj.body.length
			return obj
		}
	},
	'KKFP': {
		idAliases: {
			'upstreamKeyerId': 'keyerIndex',
			'mixEffect': 'mixEffectIndex'
		},
		propertyAliases: {
			'bevelPosition': (val: any) => ({ val, name: 'borderBevelPosition' }),
			'bevelSoftness': (val: any) => ({ val, name: 'borderBevelSoftness' }),
			'innerSoftness': (val: any) => ({ val, name: 'borderInnerSoftness' }),
			'innerWidth': (val: any) => ({ val: Math.round(val * 100), name: 'borderInnerWidth' }),
			'keyFrame': (val: any) => ({ val, name: 'keyFrameId' }),
			'outerSoftness': (val: any) => ({ val, name: 'borderOuterSoftness' }),
			'outerWidth': (val: any) => ({ val: Math.round(val * 100), name: 'borderOuterWidth' }),
			'xPosition': (val: any) => ({ val: Math.round(val * 1000), name: 'positionX' }),
			'xSize': (val: any) => ({ val: Math.round(val * 1000), name: 'sizeX' }),
			'yPosition': (val: any) => ({ val: Math.round(val * 1000), name: 'positionY' }),
			'ySize': (val: any) => ({ val: Math.round(val * 1000), name: 'sizeY' }),
			'rotation': (val: any) => ({ val: Math.round(val * 10) }),
			'borderHue': (val: any) => ({ val: Math.round(val * 10) }),
			'borderLuma': (val: any) => ({ val: Math.round(val * 10) }),
			'borderSaturation': (val: any) => ({ val: Math.round(val * 10) }),
			'lightSourceDirection': (val: any) => ({ val: Math.round(val * 10) }),
			'maskBottom': (val: any) => ({ val: Math.round(val * 1000) }),
			'maskTop': (val: any) => ({ val: Math.round(val * 1000) }),
			'maskLeft': (val: any) => ({ val: Math.round(val * 1000) }),
			'maskRight': (val: any) => ({ val: Math.round(val * 1000) })
		},
		customMutate: (obj: any) => {
			delete obj.maskEnabled
			return obj
		}
	},
	'MPCE': {
		idAliases: {
			'mediaPlayerId': 'index'
		},
		propertyAliases: {},
		customMutate: (obj: any) => {
			obj.clipIndex = 0
			obj.stillIndex = 0
			if (obj.sourceType === 1) {
				obj.stillIndex = obj.sourceIndex
			} else {
				obj.clipIndex = obj.sourceIndex
			}
			delete obj.sourceIndex
			return obj
		}
	},
	'MPSS': {
		idAliases: {
			'mediaPlayerId': 'index'
		},
		propertyAliases: {}
	}
}

describe('Commands v7.2', () => {
	const commandParser = new CommandParser()
	commandParser.version = ProtocolVersion.V7_2

	ensureAllCommandsCovered(commandParser, TestCases)

	for (let i = 0; i < TestCases.length; i++) {
		const testCase = TestCases[i]
		switch (testCase.name) {
			// Temporarily ignore the failures
			case 'FTSU': // Unkown props getting overwritten by generator: https://github.com/LibAtem/LibAtem/blob/master/LibAtem/Commands/DataTransfer/DataTransferDownloadRequestCommand.cs
			case 'TDpP': // Range validation errors
				continue
		}

		runTestForCommand(commandParser, commandConverters, i, testCase, true)
	}
})
