import { Atem } from '../index'

test('Simple test', () => {
	const nb = new Atem()
	nb.on('error', () => null)

	expect(nb).toBeTruthy()
})
