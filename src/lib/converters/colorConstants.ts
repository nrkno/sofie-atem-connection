export interface ColorConvertConstants {
	readonly KR: number
	readonly KB: number
	readonly KG: number

	readonly KRi: number
	readonly KBi: number

	readonly YRange: number
	readonly CbCrRange: number
	readonly HalfCbCrRange: number

	readonly YOffset: number
	readonly CbCrOffset: number

	readonly KRKRioKG: number
	readonly KBKBioKG: number

	readonly KRoKBi: number
	readonly KGoKBi: number
	readonly KBoKRi: number
	readonly KGoKRi: number
}

function createColorConvertConstants(KR: number, KB: number): ColorConvertConstants {
	const KG = 1 - KR - KB

	const KRi = 1 - KR
	const KBi = 1 - KB

	const YRange = 219
	const CbCrRange = 224
	const HalfCbCrRange = CbCrRange / 2

	return {
		KR,
		KB,
		KG,

		KRi,
		KBi,

		YRange,
		CbCrRange,
		HalfCbCrRange,

		YOffset: 16 << 8,
		CbCrOffset: 128 << 8,

		KRKRioKG: (KR * KRi * 2) / KG,
		KBKBioKG: (KB * KBi * 2) / KG,

		KRoKBi: (KR / KBi) * HalfCbCrRange,
		KGoKBi: (KG / KBi) * HalfCbCrRange,
		KBoKRi: (KB / KRi) * HalfCbCrRange,
		KGoKRi: (KG / KRi) * HalfCbCrRange,
	}
}

export const ColorConvertConstantsBT709 = createColorConvertConstants(0.2126, 0.0722)
export const ColorConvertConstantsBT601 = createColorConvertConstants(0.299, 0.114)
