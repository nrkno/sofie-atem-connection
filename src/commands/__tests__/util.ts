import { CommandParser } from '../../lib/atemCommandParser'
import AbstractCommand from '../AbstractCommand'
import * as Commands from '..'

export type CommandTestConverterSet = { [key: string]: CommandTestConverter }
export interface CommandTestConverter {
	idAliases: { [key: string]: string }
	propertyAliases: { [key: string]: (v: any) => { name?: string, val: any } }
	customMutate?: (v: any) => any
}

export interface TestCase {
	name: string
	bytes: string
	command: { [key: string]: any }
}

export class CommandFactory {
	commands: {[key: string]: AbstractCommand} = {}

	constructor () {
		for (const cmd in Commands) {
			try {
				const rawName = new (Commands as any)[cmd]().rawCommand
				if (rawName) {
					this.commands[rawName] = (Commands as any)[cmd]
				}
			} catch (e) {
				// wwwwhatever
			}
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


export function runTestForCommand (commandParser: CommandParser, commandFactory: CommandFactory, commandConverters: CommandTestConverterSet, testCase: TestCase, allowUnknown?: boolean) {
	const buffer = Buffer.from(testCase.bytes.replace(/-/g, ''), 'hex')
	const length = buffer.readUInt16BE(0)
	const name = buffer.toString('ascii', 4, 8)

	const converter = commandConverters[name]

	let mutatedCommand: { [key: string]: any } = {}
	for (const key in testCase.command) {
		const newKey = key[0].toLowerCase() + key.substring(1)
		const propConv = converter ? converter.propertyAliases[`${name}.${newKey}`] || converter.propertyAliases[newKey] : undefined
		const newProp = propConv ? propConv(testCase.command[key]) : { val: testCase.command[key] }

		mutatedCommand[newProp.name || newKey] = newProp.val
	}

	if (converter && converter.customMutate) {
		mutatedCommand = converter.customMutate(mutatedCommand)
	}

	const cmd = commandParser.commandFromRawName(name)
	const cmd2 = commandFactory.commandFromRawName(name)
	if (cmd && typeof cmd.deserialize === 'function') {
		cmd.deserialize(buffer.slice(0, length).slice(8))

		delete cmd.flag // Anything deserialized will never have flags
		delete cmd.rawName
		delete (cmd as any).rawCommand

		if (converter) {
			for (const key in cmd) {
				const newName = converter.idAliases[key]
				if (cmd.hasOwnProperty(key) && newName) {
					if (!cmd.properties) cmd.properties = {}
					cmd.properties[newName] = (cmd as any)[key]
				}
			}
		}

		expect(cmd.properties).toEqual(mutatedCommand)
	} else if (cmd2 && typeof cmd2.serialize === 'function') {
		if (converter) {
			for (const id of Object.keys(converter.idAliases)) {
				const id2 = converter.idAliases[id];
				(cmd2 as any)[id] = mutatedCommand[id2]
				delete mutatedCommand[id2]
			}
		}

		cmd2.properties = mutatedCommand

		const encodedBytes = cmd2.serialize()
		expect(length).toEqual(encodedBytes.length + 4)
		expect(buffer.slice(4)).toEqual(encodedBytes)
	} else {
		// Otherwise ignore, as its not supported
		// TODO - should they be ignored in here, or filtered in the generator project?
		expect(allowUnknown).toBeTruthy()
	}
}
