import { RecordingError, RecordingStatus, RecordingDiskStatus } from '../enums'
import { Timecode } from './common'

export interface RecordingState {
	status?: RecordingStateStatus
	properties: RecordingStateProperties

	duration?: Timecode

	disks: { [id: number]: RecordingDiskProperties | undefined }
}

export interface RecordingDiskProperties {
	diskId: number
	volumeName: string
	recordingTimeAvailable: number
	status: RecordingDiskStatus
}

export interface RecordingStateStatus {
	state: RecordingStatus
	error: RecordingError

	recordingTimeAvailable: number
}

export interface RecordingStateProperties {
	filename: string

	workingSet1DiskId: number
	workingSet2DiskId: number

	recordInAllCameras: boolean
}
