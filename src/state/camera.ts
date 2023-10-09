// import { ExternalPortType, InternalPortType, MeAvailability, SourceAvailability } from '../enums'

export interface Camera {
	readonly cameraID: number
	autoIris: boolean,
	bars: boolean,
	calltally: boolean,
	tint: number,
	gaindb: number,
	shutterValue: number,
	whiteBalanceValue: number,
	iris: number,
	liftR: number,
	gammaR: number,
	gainR: number,
	liftG: number,
	gammaG: number,
	gainG: number,
	liftB: number,
	gammaB: number,
	gainB: number,
	liftY: number,
	gammaY: number,
	gainY: number,
	lumMix: number,
	hue: number,
	contrast: number,
	pivot: number,
	saturation: number,
	command: string
}
