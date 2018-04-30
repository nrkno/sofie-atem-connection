import {
	ExternalPortType,
	InternalPortType,
	MeAvailability,
	SourceAvailability
} from '../enums'

export interface InputChannel {
	readonly inputId: number,
	longName: string
	shortName: string
	isExternal: boolean
	readonly externalPorts: Array<ExternalPortType> | null
	externalPortType: ExternalPortType
	readonly internalPortType: InternalPortType
	readonly sourceAvailability: SourceAvailability
	readonly meAvailability: MeAvailability
}
