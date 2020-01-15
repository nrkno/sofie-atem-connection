import { Model, ProtocolVersion } from '../enums'

export interface AtemCapabilites {
	readonly mixEffects: number
	readonly sources: number
	readonly auxilliaries: number
	readonly mixMinusOutputs: number
	readonly mediaPlayers: number
	readonly serialPorts: number
	readonly maxHyperdecks: number
	readonly DVEs: number
	readonly stingers: number
	readonly superSources: number
	// readonly talkbackOverSDI: number
	readonly downstreamKeyers: number
	readonly cameraControl: boolean
	readonly advancedChromaKeyers: boolean
}

export interface MixEffectInfo {
	readonly keyCount: number
}

export interface SuperSourceInfo {
	readonly boxCount: number
}

export interface AudioMixerInfo {
	readonly inputs: number
	readonly monitors: number
}

export interface MacroPoolInfo {
	readonly macroCount: number
}

export interface MediaPoolInfo {
	readonly stillCount: number
	readonly clipCount: number
}

export interface MultiviewerInfo {
	readonly count: number
	readonly windowCount: number
}

export interface DeviceInfo {
	apiVersion: ProtocolVersion
	capabilities?: AtemCapabilites
	model: Model
	productIdentifier?: string
	superSources: Array<SuperSourceInfo | undefined>
	mixEffects: Array<MixEffectInfo | undefined>
	power: boolean[]
	audioMixer?: AudioMixerInfo
	macroPool?: MacroPoolInfo
	mediaPool?: MediaPoolInfo
	multiviewer?: MultiviewerInfo
}
