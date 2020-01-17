import { CommandParser } from '../../lib/atemCommandParser'
import { TestCase, runTestForCommand, CommandTestConverterSet, ensureAllCommandsCovered } from './util'
import { ProtocolVersion } from '../../enums'

const TestCases = require('./data-v8.0.1.json') as TestCase[]

const commandConverters: CommandTestConverterSet = {
	'DDsA': {
		idAliases: {
			'downstreamKeyerId': 'index'
		},
		propertyAliases: {}
	},
	'DskS': {
		idAliases: {
			'downstreamKeyerId': 'index'
		},
		propertyAliases: {}
	}
}

describe('Commands v8.0.1', () => {
	const commandParser = new CommandParser()
	commandParser.version = ProtocolVersion.V8_0_1

	ensureAllCommandsCovered(commandParser, TestCases)

	for (let i = 0; i < TestCases.length; i++) {
		const testCase = TestCases[i]
		// console.log(testCase)

		switch (testCase.name) {
			// Not parsed
			// case '_MvC':
			// 	continue
		}

		runTestForCommand(commandParser, commandConverters, i, testCase)
	}
})
