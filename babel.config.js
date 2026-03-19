module.exports = function (api) {
	api.cache(true)

	return {
		presets: ['module:@react-native/babel-preset'],

		plugins: [
			[
				'module-resolver',
				{
					root: ['./'],
					alias: {
						'app': './src/app',
						'navigation': './src/navigation',
						'screens': './src/screens',
						'services': './src/services',
						'shared': './src/shared',
						'stores': './src/stores',
					}
				}
			],
			['react-native-unistyles/plugin', {
				root: 'src'
			}],
			['react-native-worklets/plugin']
		]
	}
}