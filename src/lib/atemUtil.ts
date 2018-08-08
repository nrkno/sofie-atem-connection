import { ChildProcess } from 'child_process'

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

	export function parseNumberBetween (num: number, min: number, max: number): number {
		if (num > max) throw Error(`Number too big: ${num} > ${max}`)
		else if (num < min) throw Error(`Number too small: ${num} < ${min}`)
		return num
	}

	export function parseEnum<G> (value: G, type: any): G {
		if (!type[value]) throw Error('Value is not a valid option in enum')
		return value
	}

	export function subprocessSendPromise (subprocess: ChildProcess | null, message: any) {
		return new Promise((resolve, reject) => {
			if (!subprocess) {
				return resolve()
			}

			subprocess.send(message, (error: Error) => {
				if (error) {
					reject(error)
				} else {
					resolve()
				}
			})
		})
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
