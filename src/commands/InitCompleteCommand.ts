import { DeserializedCommand } from './CommandBase'

export class InitCompleteCommand extends DeserializedCommand<null> {
	static readonly rawName = 'InCm'

	constructor () {
		super(null)
	}

	static deserialize () {
		return new InitCompleteCommand()
	}

	applyToState () {
		return `info`
	}
}
