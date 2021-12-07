import { FontFace } from 'freetype2'
import { VideoFormat, VideoMode } from '../enums'
import { AtemState } from '../state'
import { getVideoModeInfo } from './atemUtil'

/**
 * Colour lookup table for converting 8bit grey to the atem encoding
 * Note: not every colour is available, so values have been extrapolated to fill in the gaps
 */
const colourLookupTable = [
	14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
	14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 29, 85, 132, 17, 30, 30, 96, 136, 136, 186, 101, 101, 13, 19, 19, 72,
	217, 217, 124, 130, 123, 47, 28, 51, 32, 192, 166, 56, 167, 193, 189, 172, 198, 198, 41, 41, 154, 81, 109, 109, 199,
	60, 108, 37, 12, 12, 15, 153, 142, 142, 68, 35, 35, 173, 141, 197, 197, 144, 94, 94, 116, 42, 214, 214, 40, 46, 46,
	184, 181, 127, 127, 175, 31, 31, 150, 213, 73, 95, 86, 191, 191, 117, 135, 135, 208, 22, 78, 78, 107, 179, 179, 210,
	119, 58, 58, 67, 209, 209, 171, 110, 89, 89, 103, 133, 43, 202, 137, 66, 66, 39, 151, 129, 71, 200, 200, 26, 111,
	128, 16, 16, 23, 23, 196, 201, 36, 106, 207, 205, 205, 69, 139, 62, 105, 90, 203, 203, 216, 54, 99, 99, 100, 88, 88,
	146, 145, 74, 74, 80, 204, 204, 180, 84, 138, 212, 215, 24, 24, 63, 187, 187, 118, 148, 183, 183, 57, 102, 102, 206,
	44, 152, 152, 190, 134, 134, 59, 182, 87, 87, 48, 174, 125, 104, 140, 140, 188, 92, 131, 178, 64, 70, 70, 76, 65,
	79, 121, 113, 176, 176, 177, 211, 75, 75, 120, 82, 82, 93, 98, 122, 122, 53, 115, 115, 45, 55, 34, 34,
]

interface ResolutionSpec {
	width: number
	height: number
	xPad: number
	yPadBottom: number
	yPadTop: number
	fontHeight: number
}
const Res4K: ResolutionSpec = {
	width: 640,
	height: 100,
	xPad: 10,
	yPadBottom: 8,
	yPadTop: 4,
	fontHeight: 48,
}
const Res1080: ResolutionSpec = {
	width: 320,
	height: 50,
	xPad: 10,
	yPadBottom: 8,
	yPadTop: 4,
	fontHeight: 28,
}
const Res720: ResolutionSpec = {
	width: 320, // TODO - is this correct for all models?
	height: 40,
	xPad: 10,
	yPadBottom: 8,
	yPadTop: 4,
	fontHeight: 18,
}

// const transparentColour = 0 // encoded value
const bgColour = colourLookupTable[0] // 'background' value
const borderColour = 0x05 // encoded value

function calculateWidthAndTrimText(
	face: FontFace,
	str: string,
	maxWidth: number
): {
	width: number
	str: string
} {
	let trimmedStr = '' // currently measured string
	let advanceWidth = 0 // width including advance to next char
	let textWidth = 0 // width assuming it ends after this char

	for (let i = 0; i < str.length; i++) {
		const ch = face.loadChar(str.charCodeAt(i), { render: false })

		if (advanceWidth + ch.metrics.width / 64 > maxWidth) {
			// Char makes the string too wide
			break
		}

		// We can keep this char
		textWidth = advanceWidth + ch.metrics.width / 64
		advanceWidth = advanceWidth + ch.metrics.horiAdvance / 64
		trimmedStr += str[i]
	}

	return { str: trimmedStr, width: textWidth }
}

function drawTextToBuffer(
	face: FontFace,
	buffer: Buffer,
	spec: ResolutionSpec,
	rawText: string,
	bufferYOffset: number,
	bufferWidth: number
): void {
	face.setPixelSizes(spec.fontHeight, spec.fontHeight)

	const { width: textWidth, str: newStr } = calculateWidthAndTrimText(face, rawText, spec.width - spec.xPad * 2)
	const boundaryWidth = textWidth + spec.xPad * 2
	const boundaryHeight = spec.fontHeight + spec.yPadTop + spec.yPadBottom
	const bufferXOffset = Math.floor((bufferWidth - spec.width) / 2)

	// Fill background of boundary, and a 2px border
	const boundaryYOffset = Math.max(Math.floor((spec.height - boundaryHeight) / 2), 0) + bufferYOffset
	const boundaryXOffset = Math.max(Math.floor((spec.width - boundaryWidth) / 2), 0) + bufferXOffset
	function drawHorizontalLine(y: number, xOffset: number, length: number, colour: number): void {
		const offset = (boundaryYOffset + y) * bufferWidth + boundaryXOffset + xOffset
		buffer.fill(colour, offset, offset + length)
	}

	for (let y = 0; y < boundaryHeight; y++) {
		const isBorder = y == 0 || y == 1 || y === boundaryHeight - 1 || y === boundaryHeight - 2

		if (isBorder) {
			drawHorizontalLine(y, 0, boundaryWidth, borderColour)
		} else {
			drawHorizontalLine(y, 0, 2, borderColour)
			drawHorizontalLine(y, boundaryWidth - 2, 2, borderColour)

			drawHorizontalLine(y, 2, boundaryWidth - 4, bgColour)
		}
	}

	const maxLeft = boundaryXOffset + spec.width + spec.xPad
	let charLeft = boundaryXOffset + spec.xPad
	const textTop = boundaryYOffset + spec.fontHeight + spec.yPadTop

	// Draw text characters
	for (let i = 0; i < newStr.length; i++) {
		const ch = face.loadChar(newStr.charCodeAt(i), { render: true })

		const endCharLeft = charLeft + ch.metrics.horiAdvance / 64
		if (endCharLeft >= maxLeft) {
			// guard to avoid buffer index overflow
			break
		}

		const charTop = textTop - ch.metrics.horiBearingY / 64

		if (ch.bitmap) {
			for (let y = 0; y < ch.bitmap.height; y++) {
				for (let x = 0; x < ch.bitmap.width; x++) {
					const rawCol = ch.bitmap.buffer[x + y * ch.bitmap.width]
					const myCol = colourLookupTable[rawCol]
					if (myCol !== undefined) {
						// If we have a colour, update the image
						buffer[x + charLeft + (y + charTop) * bufferWidth] = myCol
					}
				}
			}
		}

		charLeft = endCharLeft
	}
}

export interface GenerateMultiviewerLabelProps {
	HD1080: boolean
	HD720: boolean
	UHD4K: boolean
}

/**
 * Generate a label for the multiviewer at multiple resolutions
 * @param face freetype2.FontFace to draw with
 * @param str String to write
 * @param props Specify which resolutions to generate for
 * @returns Buffer
 */
export function generateMultiviewerLabel(face: FontFace, str: string, props: GenerateMultiviewerLabelProps): Buffer {
	// Calculate the sizes
	let width: number | undefined
	let height = 0
	if (props.UHD4K) {
		if (!width) width = Res4K.width
		height += Res4K.height
	}
	if (props.HD1080) {
		if (!width) width = Res1080.width
		height += Res1080.height
	}
	if (props.HD720) {
		if (!width) width = Res720.width
		height += Res720.height
	}

	if (!width || !height) throw new Error('At least one resolution must be chosen!')

	const buffer = Buffer.alloc(width * height)
	const width2 = width

	let yOffset = 0
	const drawRes = (spec: ResolutionSpec): void => {
		drawTextToBuffer(face, buffer, spec, str, yOffset, width2)
		yOffset += spec.height
	}

	if (props.UHD4K) drawRes(Res4K)
	if (props.HD1080) drawRes(Res1080)
	if (props.HD720) drawRes(Res720)

	return buffer
}

export function calculateGenerateMultiviewerLabelProps(state: AtemState | null): GenerateMultiviewerLabelProps | null {
	if (state && state.info.supportedVideoModes) {
		const res: GenerateMultiviewerLabelProps = {
			UHD4K: false,
			HD1080: false,
			HD720: false,
		}

		const multiViewerModes = new Set<VideoMode>()
		for (const info of state.info.supportedVideoModes) {
			for (const mode of info.multiviewerModes) {
				multiViewerModes.add(mode)
			}
		}

		for (const mode of multiViewerModes.values()) {
			const format = getVideoModeInfo(mode)?.format
			switch (format) {
				case VideoFormat.HD720:
					res.HD720 = true
					break
				case VideoFormat.HD1080:
					res.HD1080 = true
					break
				case VideoFormat.UHD4K:
					res.UHD4K = true
					break
				case VideoFormat.UDH8K:
					// TODO
					break
				case undefined:
				case VideoFormat.SD:
					// unsupported
					break
			}
		}

		return res
	}

	return null
}
