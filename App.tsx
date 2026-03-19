/* eslint-disable unicorn/filename-case */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useEffect } from 'react'
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native'

import { hide } from 'react-native-bootsplash'
import { NewAppScreen } from '@react-native/new-app-screen'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'

function App() {
	const isDarkMode = useColorScheme() === 'dark'

	useEffect(() => {
		const timeout = setTimeout(() => {
			void hide({ fade: true })
		}, 1000)

		return () => {
			clearTimeout(timeout)
		}
	}, [])

	return (
		<SafeAreaProvider>
			<StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
			<AppContent />
		</SafeAreaProvider>
	)
}

function AppContent() {
	const safeAreaInsets = useSafeAreaInsets()

	return (
		<View style={styles.container}>
			<NewAppScreen templateFileName="App.tsx" safeAreaInsets={safeAreaInsets} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})

export default App
