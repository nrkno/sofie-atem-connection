import { Commands } from '../index'
import { listVisibleInputs } from '../lib/tally'

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { parseAtemState } from './util'

function readJson (fileName: string) {
	const filePath = resolve(__dirname, fileName)
	const fileData = readFileSync(filePath)
	return JSON.parse(fileData as any)
}

function loadRawState (file: string) {
	return parseAtemState(readJson(`./tally/${file}-state.json`))
}
function loadTally (file: string) {
	const rawTally = readJson(`./tally/${file}-tally.json`) as Commands.TallyBySourceCommand['properties']

	const program: number[] = []
	const preview: number[] = []
	for (const id in rawTally) {
		const elm = rawTally[id]
		if (elm && elm.program) {
			program.push(Number(id))
		}
		if (elm && elm.preview) {
			preview.push(Number(id))
		}
	}

	return {
		program: program.sort(),
		preview: preview.sort()
	}
}

function runTestMe1 (name: string, filename: string) {
	const rawTally = loadTally(filename)
	const rawState = loadRawState(filename)

	test(`${name} - program`, () => {
		const res = listVisibleInputs('program', rawState, 0).sort()
		expect(res).toEqual(rawTally.program)
	})
	test(`${name} - preview`, () => {
		const res = listVisibleInputs('preview', rawState, 0).sort()
		expect(res).toEqual(rawTally.preview)
	})
}

describe('tally', () => {
	/**
	 * Test cases can be generated with the dump.js script.
	 * These tests compare listVisibleInputs against the atem TlSr command
	 */
	runTestMe1('dsk active', 'dsk-active')
	runTestMe1('dsk in auto', 'dsk-in-auto')
	runTestMe1('ssrc', 'ssrc')
	runTestMe1('ssrc2', 'ssrc2')
	runTestMe1('upstream keyers', 'upstream-keyers')
	runTestMe1('mid wipe - no border', 'mid-wipe-no-border')
	runTestMe1('mid wipe - with border', 'mid-wipe-with-border')
	runTestMe1('mid dip', 'mid-dip')
	runTestMe1('mid sting', 'mid-trans-sting')
	runTestMe1('mid dve - no inputs', 'mid-trans-dve')
	runTestMe1('mid dve - with fill', 'mid-trans-dve-with-fill')
	runTestMe1('mid dve - with fill and key', 'mid-trans-dve-with-fill-and-key')
	runTestMe1('preview transition', 'preview-trans')
	runTestMe1('mid preview transition', 'mid-preview-trans')
	runTestMe1('chain me2 pgm', 'chain-me2-pgm')
	runTestMe1('chain me2 pvw', 'chain-me2-pvw')
})
