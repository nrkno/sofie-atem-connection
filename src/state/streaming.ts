import { StreamingError, StreamingStatus } from '../enums'
import { Timecode } from './common'

export interface StreamingState {
	status?: StreamingStateStatus
	stats?: StreamingStateStats
	service: StreamingServiceProperties

	duration?: Timecode
}

export interface StreamingStateStatus {
	readonly state: StreamingStatus
	readonly error: StreamingError
}

export interface StreamingStateStats {
	readonly cacheUsed: number
	readonly encodingBitrate: number
}

export interface StreamingServiceProperties {
	serviceName: string
	url: string
	key: string

	bitrates: [number, number]
}
