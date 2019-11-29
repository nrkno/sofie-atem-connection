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
	manager.startCommandSending(cmd => {
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
	})
	return manager
}

test('Test Still upload', async () => {
	const spec: any[] = JSON.parse(readFileSync(path.join(__dirname, './upload-still-sequence.json')).toString())

	const newBuffer = Buffer.alloc(1920 * 1080 * 4, 0)

	const manager = runDataTransferTest(spec)
	await manager.uploadStill(0, newBuffer, 'some still', '')

	await new Promise(resolve => setTimeout(resolve, 1000))

	// Nothing should be left by this point
	expect(spec).toHaveLength(0)
})

// function cleanupAtem (atem: Atem) {
// 	const atem2 = atem as any
// 	atem2.dataTransferManager.stop()

// 	const sock = atem2.socket._socketProcess
// 	sock.removeAllListeners()
// 	sock.kill()
// }

// test('TMP: Generate DataTransferSpec', async () => {
// 	const newBuffer = Buffer.alloc(1920 * 1080 * 4, 0)

// 	const nb = new Atem({ debug: false })
// 	try {
// 		nb.on('error', () => null)

// 		await new Promise(resolve => {
// 			nb.on('connected', resolve)
// 			nb.connect('10.42.13.99')
// 		})

// 		const commands: any[] = []

// 		const procCmd = (cmd: AbstractCommand, dir: string) => {
// 			const props = { ...cmd.properties }
// 			Object.keys(props).forEach(k => {
// 				if (Buffer.isBuffer(props[k])) {
// 					const buf = props[k] as Buffer
// 					props[k] = { bufferLength: buf.length }
// 				}
// 			})
// 			return {
// 				name: cmd.constructor.name,
// 				properties: props,
// 				direction: dir
// 			}
// 		}

// 		const transfer = new DataTransferManager(cmd => {
// 			commands.push(procCmd(cmd, 'send'))
// 			return nb.sendCommand(cmd)
// 		})
// 		nb.on('receivedCommand', cmd => {
// 			commands.push(procCmd(cmd, 'recv'))
// 			transfer.handleCommand(cmd)
// 		})

// 		await transfer.uploadStill(0, newBuffer, 'some still', '')

// 		await new Promise(resolve => setTimeout(resolve, 1000))

// 		// console.log(JSON.stringify({
// 		// 	sent: sentCommands,
// 		// 	received: receivedCommands
// 		// }))
// 		writeFileSync('upload.json', JSON.stringify(commands, undefined, '\t'))

// 		expect(nb).toBeTruthy()
// 	} finally {
// 		cleanupAtem(nb)
// 	}
// })
