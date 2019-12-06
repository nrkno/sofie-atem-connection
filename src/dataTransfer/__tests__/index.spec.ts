import * as DataTransferCommands from '../../commands/DataTransfer'
import { readFileSync } from 'fs'
import * as path from 'path'
import { DataTransferManager } from '..'

function specToCommandClass (spec: any) {
	for (const commandName in DataTransferCommands) {
		if (spec.name === commandName) {
			const cmdCons = (DataTransferCommands as any)[commandName]
			const cmd = new cmdCons(spec.properties)
			cmd.properties = spec.properties
			return cmd
		}
	}
	return undefined
}

function mangleCommand (cmd: any, dir: string) {
	const props = { ...cmd.properties }
	Object.keys(props).forEach(k => {
		if (Buffer.isBuffer(props[k])) {
			const buf = props[k] as Buffer
			props[k] = { bufferLength: buf.length }
		}
	})
	return {
		name: cmd.constructor.name,
		properties: props,
		direction: dir
	}
}

function runDataTransferTest (spec: any) {
	const manager = new DataTransferManager()
	manager.startCommandSending(cmds => cmds.map(cmd => {
		const expectedCmd = spec.shift()
		const gotCmd = mangleCommand(cmd, 'send')
		expect(expectedCmd).toEqual(gotCmd)

		while (spec.length > 0) {
			if (spec[0].direction !== 'recv') break
			const nextCmd = spec.shift()
			const nextCmd2 = specToCommandClass(nextCmd)
			if (!nextCmd2) throw new Error(`Failed specToCommandClass ${nextCmd.name}`)
			manager.handleCommand(nextCmd2)
		}

		return Promise.resolve(cmd)
	}))
	return manager
}

test('Test Still upload', async () => {
	const spec: any[] = JSON.parse(readFileSync(path.join(__dirname, './upload-still-sequence.json')).toString())

	const newBuffer = Buffer.alloc(1920 * 1080 * 4, 0)

	const manager = runDataTransferTest(spec)
	await manager.uploadStill(2, newBuffer, 'some still', '')

	await new Promise(resolve => setTimeout(resolve, 200))

	// Nothing should be left by this point
	expect(spec).toHaveLength(0)
})

test('Test Wav upload', async () => {
	const spec: any[] = JSON.parse(readFileSync(path.join(__dirname, './upload-wav-sequence.json')).toString())

	const newBuffer = readFileSync(path.join(__dirname, './sampleAudio.wav'))

	const manager = runDataTransferTest(spec)
	await manager.uploadAudio(1, newBuffer, 'audio file')

	await new Promise(resolve => setTimeout(resolve, 200))

	// Nothing should be left by this point
	expect(spec).toHaveLength(0)
})

test('Test clip upload', async () => {
	const spec: any[] = JSON.parse(readFileSync(path.join(__dirname, './upload-clip-sequence.json')).toString())

	const newBuffer = Buffer.alloc(1920 * 1080 * 4, 0)

	const manager = runDataTransferTest(spec)
	await manager.uploadClip(1, [newBuffer, newBuffer, newBuffer], 'clip file')

	await new Promise(resolve => setTimeout(resolve, 200))

	// Nothing should be left by this point
	expect(spec).toHaveLength(0)
}, 10000)
