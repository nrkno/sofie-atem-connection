import AbstractCommand from './AbstractCommand'

export class InitCompleteCommand extends AbstractCommand {
	static readonly rawName = 'InCm'
	readonly properties: null = null

	static deserialize () {
		return new InitCompleteCommand()
	}

	applyToState () {
		return `info`
	}
}
