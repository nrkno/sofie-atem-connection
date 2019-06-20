import { CommandParser } from '../../lib/atemCommandParser'

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

export function runTestForCommand (commandParser: CommandParser, commandConverters: CommandTestConverterSet, testCase: TestCase, allowUnknown?: boolean) {
	const buffer = Buffer.from(testCase.bytes.replace(/-/g, ''), 'hex')
	const length = buffer.readUInt16BE(0)
	const name = buffer.toString('ascii', 4, 8)

	const cmd = commandParser.commandFromRawName(name)
	if (cmd && typeof cmd.deserialize === 'function') {
		cmd.deserialize(buffer.slice(0, length).slice(8))

		delete cmd.flag // Anything deserialized will never have flags
		delete cmd.rawName
		delete (cmd as any).rawCommand
		// console.log('ok', cmd)

		const converter = commandConverters[name]

		if (converter) {
			for (const key in cmd) {
				const newName = converter.idAliases[key]
				if (cmd.hasOwnProperty(key) && newName) {
					if (!cmd.properties) cmd.properties = {}
					cmd.properties[newName] = (cmd as any)[key]
				}
			}
		}

		let lowerCommand: { [key: string]: any } = {}
		for (const key in testCase.command) {
			const newKey = key[0].toLowerCase() + key.substring(1)
			const propConv = converter ? converter.propertyAliases[`${name}.${newKey}`] || converter.propertyAliases[newKey] : undefined
			const newProp = propConv ? propConv(testCase.command[key]) : { val: testCase.command[key] }

			lowerCommand[newProp.name || newKey] = newProp.val
		}

		// delete lowerCommand['test1']
		// delete lowerCommand['test2']
		// delete lowerCommand['test3']
		// delete lowerCommand['unknown']

		if (converter && converter.customMutate) {
			lowerCommand = converter.customMutate(lowerCommand)
		}

		expect(cmd.properties).toEqual(lowerCommand)
	} else {
		// TODO command might be a setter and so serializable
		// console.log('command is not deserializable')

		// Otherwise ignore, as its not supported
		// TODO - should they be ignored in here, or filtered in the generator project?
		expect(allowUnknown).toBeTruthy()
	}
}