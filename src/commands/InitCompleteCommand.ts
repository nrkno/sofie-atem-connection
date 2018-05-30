import AbstractCommand from './AbstractCommand'

export class InitCompleteCommand extends AbstractCommand {
	rawName = 'InCm'
	downstreamKeyId: number
	properties: null

	deserialize (rawCommand: Buffer) {
		console.log(rawCommand)
		console.log('Initialized :D')
	}

	applyToState () {
		//
	}
}
