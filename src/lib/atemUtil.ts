export namespace Util {
	export function parseNumber (bytes: Buffer): number {
		let num = 0
		for (let i = 0; i < bytes.length; i++) {
			let byte = bytes[i]
			num += byte
			if (i < bytes.length - 1) num = num << 8
		}
		return num
	}

	export function parseString (bytes: Buffer): string {
		let str = ''
		for (let char of bytes) {
			if (char === 0) break
			str += String.fromCharCode(char)
		}
		return str
	}

	export function bufferToArray (buffers: Buffer): Array<number> {
		let arr = []
		for (let i of buffers) {
			arr.push(i)
		}
		return arr
	}

	export function bufferToBytes (from: number, numberOfBytes: number): Array<number> {
		let bytes = []
		for (let i = 0; i <= numberOfBytes; i++) {
			let shift = numberOfBytes - i - 1
			bytes.push((from >> (8 * shift) & 0xFF))
		}
		return bytes
	}

	export function stringToBytes (str: string): Array<number> {
		let array = []
		for (let val of Buffer.from(str).values()) {
			array.push(val)
		}
		return array
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
}
