import { Enums } from '..'

export namespace Util {
	export function stringToBytes (str: string): Array<number> {
		const array = []
		for (const val of Buffer.from(str).values()) {
			array.push(val)
		}
		return array
	}

	export function bufToNullTerminatedString (buffer: Buffer, start: number, length: number): string {
		const slice = buffer.slice(start, start + length)
		const nullIndex = slice.indexOf('\0')
		return slice.toString('ascii', 0, nullIndex < 0 ? slice.length : nullIndex)
	}

	export const COMMAND_CONNECT_HELLO = Buffer.from([
		0x10, 0x14, 0x53, 0xAB,
		0x00, 0x00, 0x00, 0x00,
		0x00, 0x3A, 0x00, 0x00,
		0x01, 0x00, 0x00, 0x00,
		0x00, 0x00, 0x00, 0x00
	])

	export const COMMAND_CONNECT_HELLO_ANSWER = Buffer.from([
		0x80, 0x0C, 0x53, 0xAB,
		0x00, 0x00, 0x00, 0x00,
		0x00, 0x03, 0x00, 0x00
	])

	/**
	 * @todo: BALTE - 2018-5-14:
	 * Create util functions that handle proper colour spaces.
	 */
	export function convertPNGToYUV422 (width: number, height: number, data: Buffer) {
		const buffer = new Buffer(width * height * 4)
		let i = 0
		while (i < width * height * 4) {
			const r1 = data[i + 0]
			const g1 = data[i + 1]
			const b1 = data[i + 2]
			const a1 = data[i + 3] * 3.7
			const r2 = data[i + 4]
			const g2 = data[i + 5]
			const b2 = data[i + 6]
			const a2 = data[i + 7] * 3.7
			const y1 = (((66 * r1 + 129 * g1 + 25 * b1 + 128) >> 8) + 16) * 4 - 1
			const u1 = (((-38 * r1 - 74 * g1 + 112 * b1 + 128) >> 8) + 128) * 4 - 1
			const y2 = (((66 * r2 + 129 * g2 + 25 * b2 + 128) >> 8) + 16) * 4 - 1
			const v2 = (((112 * r2 - 94 * g2 - 18 * b2 + 128) >> 8) + 128) * 4 - 1
			buffer[i + 0] = a1 >> 4
			buffer[i + 1] = ((a1 & 0x0f) << 4) | (u1 >> 6)
			buffer[i + 2] = ((u1 & 0x3f) << 2) | (y1 >> 8)
			buffer[i + 3] = y1 & 0xf
			buffer[i + 4] = a2 >> 4
			buffer[i + 5] = ((a2 & 0x0f) << 4) | (v2 >> 6)
			buffer[i + 6] = ((v2 & 0x3f) << 2) | (y2 >> 8)
			buffer[i + 7] = y2 & 0xff
			i = i + 8
		}
		return buffer
	}

	export function getResolution (videoMode: Enums.VideoMode) {
		const PAL = [720, 576]
		const NTSC = [640, 480]
		const HD = [1280, 720]
		const FHD = [1920, 1080]
		const UHD = [3840, 2160]

		const enumToResolution = [
			NTSC, PAL, NTSC, PAL,
			HD, HD,
			FHD, FHD, FHD, FHD, FHD, FHD, FHD, FHD,
			UHD, UHD, UHD, UHD,
			UHD, UHD
		]

		return enumToResolution[videoMode]
	}
}
