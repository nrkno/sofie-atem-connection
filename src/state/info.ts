import { Model } from '../enums'

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

export class DeviceInfo {
	apiVersion: VersionProps
	capabilities: AtemCapabilites
	model: Model
	productIdentifier: string
	superSourceBoxes: number
	power: boolean[]
}
