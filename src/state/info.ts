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
	readonly multiViewers: number
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

export class DeviceInfo {
	public apiVersion: ProtocolVersion = 0
	public capabilities?: AtemCapabilites
	public model: Model = Model.Unknown
	public productIdentifier?: string
	public superSources: Array<SuperSourceInfo | undefined> = []
	public mixEffects: Array<MixEffectInfo | undefined> = []
	public power: boolean[] = []
	public audioMixer?: AudioMixerInfo
	public macroPool?: MacroPoolInfo
	public mediaPool?: MediaPoolInfo
}
