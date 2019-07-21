import AbstractCommand from './AbstractCommand'

export class InitCompleteCommand extends AbstractCommand {
	rawName = 'InCm'
	properties: null

	deserialize () {
		//
	}

	applyToState () {
		//
		return `info`
	}
}
