import * as Commands from '../commands'
import AbstractCommand from '../commands/AbstractCommand'
import { ProtocolVersion } from '../enums'

type CommandConstructor = new () => AbstractCommand
export class CommandParser {
	commands: {[key: string]: Array<CommandConstructor>} = {}
	version: ProtocolVersion = ProtocolVersion.V7_2 // Default to the minimum supported

	constructor () {
		for (const cmd in Commands) {
			try {
				const cmdConstructor = (Commands as any)[cmd] as CommandConstructor
				const rawName = new cmdConstructor().rawName
				if (rawName) {
					if (!this.commands[rawName]) this.commands[rawName] = []
					this.commands[rawName].push(cmdConstructor)
				}
			} catch (e) {
				// wwwwhatever
			}
		}
	}

	commandFromRawName (name: string): AbstractCommand | undefined {
		const commandsArray = this.commands[name]
		if (commandsArray) {
			// instantiate all commands in the array for access to the version prop:
			const commands = commandsArray.map<AbstractCommand>(cmd => new (cmd as any)())

			if (!this.version) { // edge case for the version command itself:
				return commands[0]
			} else { // now we should have a version defined
				const baseline = commands.find(cmd => !cmd.minimumVersion)
				const overrides = commands.filter(cmd => cmd.minimumVersion && cmd.minimumVersion <= this.version)

				if (overrides.length === 0) return baseline

				let highestProtoCommand = overrides[0]

				for (const cmd of overrides) { // find highest version in overrides
					if (highestProtoCommand.minimumVersion && cmd.minimumVersion &&
							(cmd.minimumVersion > highestProtoCommand.minimumVersion)) {
						highestProtoCommand = cmd
					}
				}

				return highestProtoCommand
			}
		}
		return undefined
	}
}
