module.exports = {
	globals: {
		'ts-jest': {
			tsConfigFile: 'tsconfig.jest.json'
		}
	},
	moduleFileExtensions: [
		'ts',
		'js'
	],
	transform: {
		'^.+\\.(ts|tsx)$': './node_modules/ts-jest/preprocessor.js'
	},
	testMatch: [
		'**/__tests__/**/*.spec.(ts|js)'
	],
	testEnvironment: 'node',
	coverageThreshold: {
		global: {
		  branches: 100,
		  functions: 100,
		  lines: 100,
		  statements: 100
		}
	},
	coverageDirectory: "./coverage/",
	collectCoverage: true
}
