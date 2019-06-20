import { CommandParser } from '../../lib/atemCommandParser'
import { TestCase, runTestForCommand, CommandTestConverterSet, CommandFactory } from './util'

const TestCases = require('./data-v8.0.json') as TestCase[]

const commandConverters: CommandTestConverterSet = {
	'AMIP': {
		idAliases: {
			'index': 'index'
		},
		propertyAliases: {
			'balance': (v: number) => ({ val: Math.round(v * 10) / 10 }),
			'gain': (v: number) => ({ val: Math.round(v * 100) / 100 })
		}
	},
	'_top': {
		idAliases: {},
		propertyAliases: {
			'auxiliaries': (val: any) => ({ val, name: 'auxilliaries' }),
			'dVE': (val: any) => ({ val, name: 'DVEs' }),
			'hyperDecks': (val: any) => ({ val, name: 'maxHyperdecks' }),
			'mixEffectBlocks': (val: any) => ({ val, name: 'MEs' }),
			'serialPort': (val: any) => ({ val, name: 'serialPorts' }),
			'videoSources': (val: any) => ({ val, name: 'sources' })
		}
	}
}

describe('Commands v8.0', () => {
	const commandParser = new CommandParser()
	const commandFactory = new CommandFactory()

	// TODO - track which commands havent had a serialize/deserialize called and cause a failure on that, or is lack of test percentage good enough?
	// TODO - some commands appear to not have very random data. Will some not work because of their c# implementation?

	for (let i = 0; i < TestCases.length; i++) {
		const testCase = TestCases[i]
		test(`Test #${i}: ${testCase.name}`, () => {
			// console.log(testCase)

			switch (testCase.name) {
				// Not parsed
				case '_MvC':
					return
			}

			runTestForCommand(commandParser, commandFactory, commandConverters, testCase)
		})
	}
})
