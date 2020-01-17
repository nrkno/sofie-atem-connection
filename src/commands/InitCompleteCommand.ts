import { DeserializedCommand } from './CommandBase'

export class InitCompleteCommand extends DeserializedCommand<null> {
	public static readonly rawName = 'InCm'

	constructor () {
		super(null)
	}

	public static deserialize () {
		return new InitCompleteCommand()
	}

	public applyToState () {
		return `info`
	}
}
