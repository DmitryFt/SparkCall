module.exports = {
	preset: 'react-native',
	roots: ['<rootDir>/src'],
	testMatch: ['**/?(*.)+(test|spec).(ts|tsx)'],
	transformIgnorePatterns: [
		'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-reanimated|react-native-worklets)/)',
	],
	setupFiles: ['react-native-unistyles/mocks', '<rootDir>/src/shared/config/unistyles/index.ts'],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	collectCoverageFrom: [
		'src/**/*.{ts,tsx}',
		'!src/**/*.d.ts',
		'!src/**/index.ts',
		'!src/**/*.test.{ts,tsx}',
		'!src/**/*.spec.{ts,tsx}',
	],
	coverageReporters: [
		'json-summary',
		'cobertura',
		['text', { file: 'coverage.txt' }]
	],
	reporters: [
		'default',
		['github-actions', { silent: false }],
		'summary',
		[
			'jest-junit',
			{
				outputDirectory: 'coverage',
				outputName: 'jest-junit.xml',
				ancestorSeparator: ' › ',
				uniqueOutputName: 'false',
				suiteNameTemplate: '{filepath}',
				classNameTemplate: '{classname}',
				titleTemplate: '{title}',
			},
		],
	],

}
