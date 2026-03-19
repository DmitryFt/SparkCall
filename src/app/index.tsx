import 'app/app.init'

import { useEffect } from 'react'
import { StatusBar } from 'react-native'

import { hide } from 'react-native-bootsplash'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'

import { Navigation } from 'navigation'
import { hydrateAuth } from 'services/auth/hydrate-service'
import { APIProvider } from 'shared/api-provider'

function App() {
	useEffect(() => {
		const init = async () => {
			await hydrateAuth()
		}

		void init().finally(async () => {
			await hide({ fade: true })
		})
	}, [])

	return (
		<GestureHandlerRootView>
			<SafeAreaProvider initialMetrics={initialWindowMetrics}>
				<APIProvider>
					<StatusBar barStyle="dark-content" />

					<Navigation />
				</APIProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	)
}

export default App
