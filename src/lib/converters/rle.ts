export const RLE_HEADER = 0xfefefefefefefefen

export function encodeRLE(data: Buffer): Buffer {
	const result = Buffer.alloc(data.length)
	let lastBlock = data.readBigUInt64BE()
	let identicalCount = 0
	let differentCount = 0
	let resultOffset = -8

	for (let sourceOffset = 8; sourceOffset < data.length; sourceOffset += 8) {
		const block = data.readBigUInt64BE(sourceOffset)

		if (block === lastBlock) {
			++identicalCount
			if (differentCount) {
				data.copy(result, resultOffset + 8, sourceOffset - 8 * (differentCount + 1), sourceOffset - 8)
				resultOffset += differentCount * 8
				differentCount = 0
			}
			lastBlock = block
			continue
		}
		if (identicalCount > 2) {
			result.writeBigUInt64BE(RLE_HEADER, (resultOffset += 8))
			result.writeBigUInt64BE(BigInt(identicalCount + 1), (resultOffset += 8))
			result.writeBigUInt64BE(lastBlock, (resultOffset += 8))
		} else if (identicalCount > 0) {
			for (let i = 0; i <= identicalCount; ++i) {
				result.writeBigUInt64BE(lastBlock, (resultOffset += 8))
			}
		} else {
			++differentCount
		}
		lastBlock = block
		identicalCount = 0
	}

	if (identicalCount > 2) {
		result.writeBigUInt64BE(RLE_HEADER, (resultOffset += 8))
		result.writeBigUInt64BE(BigInt(identicalCount + 1), (resultOffset += 8))
		result.writeBigUInt64BE(lastBlock, (resultOffset += 8))
	} else if (identicalCount > 0) {
		for (let i = 0; i <= identicalCount; ++i) {
			result.writeBigUInt64BE(lastBlock, (resultOffset += 8))
		}
	} else {
		++differentCount
		data.copy(result, resultOffset + 8, data.length - 8 * differentCount, data.length)
		resultOffset += differentCount * 8
	}

	return result.slice(0, resultOffset + 8)
}
