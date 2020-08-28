/* eslint-disable node/no-unsupported-features/es-builtins */
import { check as checkVersion } from 'jest-verify-node-version'
import * as bigInt from 'big-integer'
import { bigIntToBuf, bufToBigInt } from '../atemUtil'

function between(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min) + min)
}

function randomBigInt(): bigint {
	let val1 = BigInt(between(1 << 31, -(1 << 31)))
	val1 = val1 << BigInt(32)
	return val1 + BigInt(between(0, -(1 << 31)))
}

describe('bigInt buffer', () => {
	if (checkVersion({ engines: { node: '>= 10.4' } }, true)) {
		for (let i = 1; i <= 100; i++) {
			test(`case ${i}`, () => {
				const val = randomBigInt()

				const buffer0 = Buffer.alloc(8)
				buffer0.writeBigInt64BE(val)

				const buffer1 = Buffer.alloc(8)
				bigIntToBuf(buffer1, bigInt(val), 0)

				// Ensure the encodings match
				expect(buffer1).toEqual(buffer0)

				// Read it back and ensure it matches
				const val2 = bufToBigInt(buffer0, 0)
				expect(val2.toArray(10)).toEqual(bigInt(val).toArray(10))
			})
		}
	} else {
		test('Not possible in node 8', () => {
			// Ignore
		})
	}
})
