import { Model, ProtocolVersion } from '../enums'

export interface VersionProps {
	readonly major: number
	readonly minor: number
}

export interface AtemCapabilites {
	readonly MEs: number
	readonly sources: number
	readonly colorGenerators: number
	readonly auxilliaries: number
	readonly talkbackOutputs: number
	readonly mediaPlayers: number
	readonly serialPorts: number
	readonly maxHyperdecks: number
	readonly DVEs: number
	readonly stingers: number
	readonly hasSuperSources: boolean
	readonly superSources: number
	readonly talkbackOverSDI: number
}

export interface SuperSourceInfo {
	boxCount: number
}

export interface TimeInfo {
	hours: number
	minutes: number
	seconds: number
	frames: number
}

export class DeviceInfo {
	apiVersion: ProtocolVersion
	capabilities: AtemCapabilites
	model: Model
	productIdentifier: string
	superSources: SuperSourceInfo[] = []
	power: boolean[]
	lastTime: TimeInfo
}
