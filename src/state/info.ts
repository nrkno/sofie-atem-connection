import { Model } from '../enums'

export class DeviceInfo {
	apiVersion = new ApiInfo()
	capabilities = new AtemCapabilites()
	model: Model
	productIdentifier: string
}

export class ApiInfo {
	major: number
	minor: number
}

export class AtemCapabilites {
	MEs: number
	sources: number
	colorGenerators: number
	auxilliaries: number
	talkbackOutputs: number
	mediaPlayers: number
	serialPorts: number
	maxHyperdecks: number
	DVEs: number
	stingers: number
	superSources: number
}
