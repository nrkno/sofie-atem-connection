import { Atem } from '../dist'
import * as fs from 'fs'

const file = fs.readFileSync('./stress/amsterdam.rgba')
// const file = fs.readFileSync('./testframe.rgba')

if (process.argv.length < 3) {
	console.error('Expected ip address as parameter')
	process.exit(1)
}
const IP = process.argv[2]

let upload = 0
let t = Date.now()

const conn = new Atem({ debug: false })

let stuckTimeout: any = null

async function uploadNext () {
	// if (upload >= MAX_POOL) {
	//     return
	// }
	// console.log('item ', upload)
	t = Date.now()
	conn.uploadStill(upload % conn.state.media.stillPool.length, file, 'contemplation..', '')
	// conn.uploadStill(upload, file, 'TEST FRAME', '')
	.then(async (_res) => {
		console.log(`Uploaded still #${upload} in ${Date.now() - t}ms at 1080p`)
		// console.log('queue len', conn.dataTransferManager.commandQueue.length)
		// console.log(conn.state.media.stillPool)
		upload++
		// if (upload % 2 === 0) {
		//     await reconnect()
		//     console.log('reconnected')
		// }

		if (stuckTimeout) {
			clearTimeout(stuckTimeout)
		}
		stuckTimeout = setTimeout(() => {
			console.log('')
			console.log('UPLOAD GOT STUCK')
			console.log('')
			console.log('')
			// console.log(JSON.stringify(conn.state, undefined, 4))
			console.log('')
			const dt = (conn as any).dataTransferManager
			// console.log(JSON.stringify({
			// 	stills: dt.stillsLock,
			// 	clips: dt.clipLocks
			// }, undefined, 4))
			fs.writeFileSync('upload-stuck', JSON.stringify({
				stills: dt.stillsLock,
				clips: dt.clipLocks
			}, undefined, 4))
		}, 20000)

		setTimeout(() => uploadNext(), 0)
		// uploadNext()
	}, (e) => {
		console.log('e', e)
		setTimeout(() => uploadNext(), 500)
		// console.log('retry')
		// setTimeout(() => uploadNext(), 0)
	})
}

// async function uploadInf () {
//     while (true) {
//         if (upload > 0) console.log(`Uploaded ${upload} in ${Date.now() - t}, is ${(Date.now() - t) / upload} at 720p`)
//         await conn.dataTransferManager.uploadStill(upload % MAX_POOL, file, 'TEST FRAME ' + upload, '').catch((e) => console.log('e', e))
//         upload++
//     }
// }

conn.on('error', console.log)
conn.on('disconnected', () => {
	console.log('Connection lost')
	process.exit(0)
})
conn.connect(IP)
conn.once('connected', () => {
	console.log(`connected in ${Date.now() - t}ms`)
	t = Date.now()
	uploadNext()
	// console.log(conn.state.media)

})
