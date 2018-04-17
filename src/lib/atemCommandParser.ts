import * as Commands from '../commands'
import AbstractCommand from '../commands/AbstractCommand'

export class CommandParser {
	commands: {[key: string]: AbstractCommand} = {}

	constructor () {
		for (let cmd in Commands) {
			let rawName = new (Commands as any)[cmd]().rawName
			this.commands[rawName] = (Commands as any)[cmd]
		}
	}

	commandFromRawName (name: string): AbstractCommand | undefined {
		if (this.commands[name]) {
			// we instantiate a class based on the raw command name
			return new (this.commands[name] as any)()
			// return Object.create((this.commands as any)[name]['prototype'])
		}
		return undefined
	}
}
