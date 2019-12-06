import { Enums } from '..'
// @ts-ignore
import WaveFile = require('wavefile')

export namespace Util {
	export function bufToBase64String (buffer: Buffer, start: number, length: number): string {
		return buffer.toString('base64', start, start + length)
	}

	export function bufToNullTerminatedString (buffer: Buffer, start: number, length: number): string {
		const slice = buffer.slice(start, start + length)
		const nullIndex = slice.indexOf('\0')
		return slice.toString('ascii', 0, nullIndex < 0 ? slice.length : nullIndex)
	}

	export function parseNumberBetween (num: number, min: number, max: number): number {
		if (num > max) {
			throw Error(`Number too big: ${num} > ${max}`)
		} else if (num < min) {
			throw Error(`Number too small: ${num} < ${min}`)
		}
		return num
	}

	export function parseEnum<G> (value: G, type: any): G {
		if (!type[value]) {
			throw Error(`Value ${value} is not a valid option in enum`)
		}
		return value
	}

	export const COMMAND_CONNECT_HELLO = Buffer.from([
		0x10, 0x14, 0x53, 0xAB,
		0x00, 0x00, 0x00, 0x00,
		0x00, 0x3A, 0x00, 0x00,
		0x01, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00
	])

	/**
	 * @todo: BALTE - 2018-5-24:
	 * Create util functions that handle proper colour spaces in UHD.
	 */
	export function convertRGBAToYUV422 (width: number, height: number, data: Buffer) {
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

		const KRoKBi = KR / KBi * HalfCbCrRange
		const KGoKBi = KG / KBi * HalfCbCrRange
		const KBoKRi = KB / KRi * HalfCbCrRange
		const KGoKRi = KG / KRi * HalfCbCrRange

		const genColor = (rawA: number, uv16: number, y16: number) => {
			const a = ((rawA << 2) * 219 / 255) + (16 << 2)
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

	export function getResolution (videoMode: Enums.VideoMode) {
		const PAL = [720, 576]
		const NTSC = [640, 480]
		const HD = [1280, 720]
		const FHD = [1920, 1080]
		const UHD = [3840, 2160]
		// TODO - add 8k options

		const enumToResolution = [
			NTSC, PAL, NTSC, PAL,
			HD, HD,
			FHD, FHD, FHD, FHD, FHD, FHD, FHD, FHD,
			UHD, UHD, UHD, UHD,
			UHD, UHD
		]

		return enumToResolution[videoMode]
	}

	export function convertWAVToRaw (inputBuffer: Buffer) {
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

	export function UInt16BEToDecibel (input: number) {
		// 0 = -inf, 32768 = 0, 65381 = +6db
		return Math.round((Math.log10(input / 32768) * 20) * 100) / 100
	}

	export function DecibelToUInt16BE (input: number) {
		return Math.floor(Math.pow(10, input / 20) * 32768)
	}

	export function IntToBalance (input: number): number {
		// -100000 = -50, 0x0000 = 0, 0x2710 = +50
		return Math.round(input / 200)
	}
	export function BalanceToInt (input: number): number {
		return Math.round(input * 200)
	}
}
