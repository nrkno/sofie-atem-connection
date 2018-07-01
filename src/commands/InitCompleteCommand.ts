import AbstractCommand from './AbstractCommand'

export class InitCompleteCommand extends AbstractCommand {
	rawName = 'InCm'
	downstreamKeyId: number
	properties: null

	deserialize () {
		//
	}

	applyToState () {
		//
	}
}
