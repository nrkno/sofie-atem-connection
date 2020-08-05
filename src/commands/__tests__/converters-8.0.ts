/* eslint-disable @typescript-eslint/camelcase */
import { PropertyAliasResult, CommandTestConverterSet } from './index.spec'

export const V8_0CommandConverters: CommandTestConverterSet = {
	SSrc: {
		idAliases: {
			ssrcId: 'sSrcId'
		},
		propertyAliases: {
			artClip: (v: number): PropertyAliasResult => ({ val: Math.round(v * 10) }),
			artGain: (v: number): PropertyAliasResult => ({ val: Math.round(v * 10) }),
			artFillInput: (v: number): PropertyAliasResult => ({ val: v, name: 'artFillSource' }),
			artKeyInput: (v: number): PropertyAliasResult => ({ val: v, name: 'artCutSource' })
		}
	},
	SSBd: {
		idAliases: {
			ssrcId: 'sSrcId'
		},
		propertyAliases: {
			lightSourceAltitude: (v: number): PropertyAliasResult => ({
				val: Math.round(v),
				name: 'borderLightSourceAltitude'
			}),
			lightSourceDirection: (v: number): PropertyAliasResult => ({
				val: Math.round(v * 10),
				name: 'borderLightSourceDirection'
			}),
			hue: (v: number): PropertyAliasResult => ({ val: Math.round(v * 10), name: 'borderHue' }),
			innerWidth: (v: number): PropertyAliasResult => ({ val: Math.round(v * 100), name: 'borderInnerWidth' }),
			luma: (v: number): PropertyAliasResult => ({ val: Math.round(v * 10), name: 'borderLuma' }),
			outerWidth: (v: number): PropertyAliasResult => ({ val: Math.round(v * 100), name: 'borderOuterWidth' }),
			saturation: (v: number): PropertyAliasResult => ({ val: Math.round(v * 10), name: 'borderSaturation' }),
			enabled: (val): PropertyAliasResult => ({ val, name: 'borderEnabled' }),
			bevel: (val): PropertyAliasResult => ({ val, name: 'borderBevel' }),
			outerSoftness: (val): PropertyAliasResult => ({ val, name: 'borderOuterSoftness' }),
			innerSoftness: (val): PropertyAliasResult => ({ val, name: 'borderInnerSoftness' }),
			bevelPosition: (val): PropertyAliasResult => ({ val, name: 'borderBevelPosition' }),
			bevelSoftness: (val): PropertyAliasResult => ({ val, name: 'borderBevelSoftness' })
		}
	},
	CSBd: {
		idAliases: {
			ssrcId: 'sSrcId'
		},
		propertyAliases: {
			lightSourceAltitude: (v: number): PropertyAliasResult => ({
				val: Math.round(v),
				name: 'borderLightSourceAltitude'
			}),
			lightSourceDirection: (v: number): PropertyAliasResult => ({
				val: Math.round(v * 10),
				name: 'borderLightSourceDirection'
			}),
			hue: (v: number): PropertyAliasResult => ({ val: Math.round(v * 10), name: 'borderHue' }),
			innerWidth: (v: number): PropertyAliasResult => ({ val: Math.round(v * 100), name: 'borderInnerWidth' }),
			luma: (v: number): PropertyAliasResult => ({ val: Math.round(v * 10), name: 'borderLuma' }),
			outerWidth: (v: number): PropertyAliasResult => ({ val: Math.round(v * 100), name: 'borderOuterWidth' }),
			saturation: (v: number): PropertyAliasResult => ({ val: Math.round(v * 10), name: 'borderSaturation' }),
			enabled: (val): PropertyAliasResult => ({ val, name: 'borderEnabled' }),
			bevel: (val): PropertyAliasResult => ({ val, name: 'borderBevel' }),
			outerSoftness: (val): PropertyAliasResult => ({ val, name: 'borderOuterSoftness' }),
			innerSoftness: (val): PropertyAliasResult => ({ val, name: 'borderInnerSoftness' }),
			bevelPosition: (val): PropertyAliasResult => ({ val, name: 'borderBevelPosition' }),
			bevelSoftness: (val): PropertyAliasResult => ({ val, name: 'borderBevelSoftness' })
		}
	}
}
