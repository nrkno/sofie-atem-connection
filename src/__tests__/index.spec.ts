import { NodeBoilerpate } from '../index'

test('Simple test', () => {
	let nb = new NodeBoilerpate('Some Data')

	expect(nb).toBeTruthy()
})
