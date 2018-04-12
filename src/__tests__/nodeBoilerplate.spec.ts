import { NodeBoilerpate } from '../index'

test('Simple test is inverse', () => {
	let nb = new NodeBoilerpate('Some Data')

	expect(nb.inverse()).toBe('ataD emoS')
})

test('Empty string is ok', () => {
	let nb = new NodeBoilerpate('')
	expect(nb.inverse()).toBe('')
})
