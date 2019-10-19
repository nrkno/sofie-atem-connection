module.exports = {
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.json'
		}
	},
	moduleFileExtensions: [
		'ts',
		'js'
	],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest'
	},
	testMatch: [
		'**/__tests__/**/*.spec.(ts|js)'
	],
	setupFilesAfterEnv: ["jest-extended"],
	testEnvironment: 'node',
	coverageThreshold: {
		global: {
		  branches: 0,
		  functions: 0,
		  lines: 0,
		  statements: 0
		}
	},
	coverageDirectory: "./coverage/",
	collectCoverage: true,
	collectCoverageFrom: [
		"**/src/**/**",
		"!**/src/@types/**",
		"!**/__tests__/**",
		"!**/__mocks__/**",
		'!**/node_modules/**',
		'!**/dist/**'
	]
}
