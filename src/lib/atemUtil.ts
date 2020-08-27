import * as Enums from '../enums'
import WaveFile = require('wavefile')

export function bufToBase64String(buffer: Buffer, start: number, length: number): string {
	return buffer.toString('base64', start, start + length)
}

export function bufToNullTerminatedString(buffer: Buffer, start: number, length: number): string {
	const slice = buffer.slice(start, start + length)
	const nullIndex = slice.indexOf('\0')
	return slice.toString('ascii', 0, nullIndex < 0 ? slice.length : nullIndex)
}

export const COMMAND_CONNECT_HELLO = Buffer.from([
	0x10,
	0x14,
	0x53,
	0xab,
	0x00,
	0x00,
	0x00,
	0x00,
	0x00,
	0x3a,
	0x00,
	0x00,
	0x01,
	0x00,
	0x00,
	0x00,
	0x00,
	0x00,
	0x00,
	0x00
])

/**
 * @todo: BALTE - 2018-5-24:
 * Create util functions that handle proper colour spaces in UHD.
 */
export function convertRGBAToYUV422(width: number, height: number, data: Buffer): Buffer {
	// BT.709 or BT.601
	const KR = height >= 720 ? 0.2126 : 0.299
	const KB = height >= 720 ? 0.0722 : 0.114
	const KG = 1 - KR - KB

	const KRi = 1 - KR
	const KBi = 1 - KB

	const YRange = 219
	const CbCrRange = 224
	const HalfCbCrRange = CbCrRange / 2

	const YOffset = 16 << 8
	const CbCrOffset = 128 << 8

	const KRoKBi = (KR / KBi) * HalfCbCrRange
	const KGoKBi = (KG / KBi) * HalfCbCrRange
	const KBoKRi = (KB / KRi) * HalfCbCrRange
	const KGoKRi = (KG / KRi) * HalfCbCrRange

	const genColor = (rawA: number, uv16: number, y16: number): number => {
		const a = ((rawA << 2) * 219) / 255 + (16 << 2)
		const y = Math.round(y16) >> 6
		const uv = Math.round(uv16) >> 6

		return (a << 20) + (uv << 10) + y
	}

	const buffer = Buffer.alloc(width * height * 4)
	for (let i = 0; i < width * height * 4; i += 8) {
		const r1 = data[i + 0]
		const g1 = data[i + 1]
		const b1 = data[i + 2]

		const r2 = data[i + 4]
		const g2 = data[i + 5]
		const b2 = data[i + 6]

		const a1 = data[i + 3]
		const a2 = data[i + 7]

		const y16a = YOffset + KR * YRange * r1 + KG * YRange * g1 + KB * YRange * b1
		const cb16 = CbCrOffset + (-KRoKBi * r1 - KGoKBi * g1 + HalfCbCrRange * b1)
		const y16b = YOffset + KR * YRange * r2 + KG * YRange * g2 + KB * YRange * b2
		const cr16 = CbCrOffset + (HalfCbCrRange * r1 - KGoKRi * g1 - KBoKRi * b1)

		buffer.writeUInt32BE(genColor(a1, cb16, y16a), i)
		buffer.writeUInt32BE(genColor(a2, cr16, y16b), i + 4)
	}
	return buffer
}

export interface VideoModeInfo {
	width: number
	height: number
}

const dimsPAL: Pick<VideoModeInfo, 'width' | 'height'> = { width: 720, height: 576 }
const dimsNTSC: Pick<VideoModeInfo, 'width' | 'height'> = { width: 640, height: 480 }
const dims720p: Pick<VideoModeInfo, 'width' | 'height'> = { width: 1280, height: 720 }
const dims1080p: Pick<VideoModeInfo, 'width' | 'height'> = { width: 1920, height: 1080 }
const dims4k: Pick<VideoModeInfo, 'width' | 'height'> = { width: 3840, height: 2160 }
const dims8k: Pick<VideoModeInfo, 'width' | 'height'> = { width: 7680, height: 4260 }
const VideoModeInfoImpl: { [key in Enums.VideoMode]: VideoModeInfo } = {
	[Enums.VideoMode.N525i5994NTSC]: {
		...dimsNTSC
	},
	[Enums.VideoMode.P625i50PAL]: {
		...dimsPAL
	},
	[Enums.VideoMode.N525i5994169]: {
		...dimsNTSC
	},
	[Enums.VideoMode.P625i50169]: {
		...dimsPAL
	},

	[Enums.VideoMode.P720p50]: {
		...dims720p
	},
	[Enums.VideoMode.N720p5994]: {
		...dims720p
	},
	[Enums.VideoMode.P1080i50]: {
		...dims1080p
	},
	[Enums.VideoMode.N1080i5994]: {
		...dims1080p
	},
	[Enums.VideoMode.N1080p2398]: {
		...dims1080p
	},
	[Enums.VideoMode.N1080p24]: {
		...dims1080p
	},
	[Enums.VideoMode.P1080p25]: {
		...dims1080p
	},
	[Enums.VideoMode.N1080p2997]: {
		...dims1080p
	},
	[Enums.VideoMode.P1080p50]: {
		...dims1080p
	},
	[Enums.VideoMode.N1080p5994]: {
		...dims1080p
	},

	[Enums.VideoMode.N4KHDp2398]: {
		...dims4k
	},
	[Enums.VideoMode.N4KHDp24]: {
		...dims4k
	},
	[Enums.VideoMode.P4KHDp25]: {
		...dims4k
	},
	[Enums.VideoMode.N4KHDp2997]: {
		...dims4k
	},

	[Enums.VideoMode.P4KHDp5000]: {
		...dims4k
	},
	[Enums.VideoMode.N4KHDp5994]: {
		...dims4k
	},

	[Enums.VideoMode.N8KHDp2398]: {
		...dims8k
	},
	[Enums.VideoMode.N8KHDp24]: {
		...dims8k
	},
	[Enums.VideoMode.P8KHDp25]: {
		...dims8k
	},
	[Enums.VideoMode.N8KHDp2997]: {
		...dims8k
	},
	[Enums.VideoMode.P8KHDp50]: {
		...dims8k
	},
	[Enums.VideoMode.N8KHDp5994]: {
		...dims8k
	},

	[Enums.VideoMode.N1080p30]: {
		...dims1080p
	},
	[Enums.VideoMode.N1080p60]: {
		...dims1080p
	}
}

export function getVideoModeInfo(videoMode: Enums.VideoMode): VideoModeInfo | undefined {
	return VideoModeInfoImpl[videoMode]
}

export function convertWAVToRaw(inputBuffer: Buffer): Buffer {
	const wav = new (WaveFile as any)(inputBuffer)

	if (wav.fmt.bitsPerSample !== 24) {
		throw new Error(`Invalid wav bit bits per sample: ${wav.fmt.bitsPerSample}`)
	}

	if (wav.fmt.numChannels !== 2) {
		throw new Error(`Invalid number of wav channels: ${wav.fmt.numChannel}`)
	}

	const buffer = Buffer.from(wav.data.samples)
	const buffer2 = Buffer.alloc(buffer.length)
	for (let i = 0; i < buffer.length; i += 3) {
		// 24bit samples, change endian
		buffer2.writeUIntBE(buffer.readUIntLE(i, 3), i, 3)
	}

	return buffer2
}

export function UInt16BEToDecibel(input: number): number {
	// 0 = -inf, 32768 = 0, 65381 = +6db
	return Math.round(Math.log10(input / 32768) * 20 * 100) / 100
}

export function DecibelToUInt16BE(input: number): number {
	return Math.floor(Math.pow(10, input / 20) * 32768)
}

export function IntToBalance(input: number): number {
	// -100000 = -50, 0x0000 = 0, 0x2710 = +50
	return Math.round(input / 200)
}
export function BalanceToInt(input: number): number {
	return Math.round(input * 200)
}

export function padToMultiple4(val: number): number {
	const r = val % 4
	if (r === 0) {
		return val
	} else {
		return val + (4 - r)
	}
}

export function getComponents(val: number): number[] {
	const res: number[] = []
	for (let next = 1; next <= val; next = next << 1) {
		if ((val & next) > 0) {
			res.push(next)
		}
	}
	return res
}

export function commandStringify(command: any): string {
	return JSON.stringify(command, (_key, value) => (typeof value === 'bigint' ? value.toString() : value))
}
