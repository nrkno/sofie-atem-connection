export interface DownstreamKeyerBase {
	onAir: boolean
	inTransition: boolean
	isAuto: boolean
	remainingFrames: number
	isTowardsOnAir?: boolean
}

export interface DownstreamKeyer extends DownstreamKeyerBase {
	sources?: {
		fillSource: number,
		cutSource: number
	}
	properties?: DownstreamKeyerProperties
}

export interface DownstreamKeyerGeneral {
	preMultiply: boolean
	clip: number
	gain: number
	invert: boolean
}

export interface DownstreamKeyerMask {
	enabled: boolean
	top: number
	bottom: number
	left: number
	right: number
}

export interface DownstreamKeyerProperties extends DownstreamKeyerGeneral {
	tie: boolean
	rate: number
	mask: DownstreamKeyerMask
}
