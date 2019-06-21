import * as Commands from '../commands'
import AbstractCommand from '../commands/AbstractCommand'

type CommandConstructor = new () => AbstractCommand
export class CommandParser {
	commands: {[key: string]: CommandConstructor} = {}

	constructor () {
		for (const cmd in Commands) {
			try {
				const cmdConstructor = (Commands as any)[cmd] as CommandConstructor
				const rawName = new cmdConstructor().rawName
				if (rawName) {
					this.commands[rawName] = cmdConstructor
				}
			} catch (e) {
				// wwwwhatever
			}
		}
	}

	commandFromRawName (name: string): AbstractCommand | undefined {
		if (this.commands[name]) {
			// we instantiate a class based on the raw command name
			return new this.commands[name]()
		}
		return undefined
	}
}
