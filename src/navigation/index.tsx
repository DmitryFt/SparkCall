import React, { useMemo } from 'react'

import { useUnistyles } from 'react-native-unistyles'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer, type Theme, type ParamListBase, DefaultTheme } from '@react-navigation/native'

import { JoinScreen } from 'screens/join'
import { CallScreen } from 'screens/call'
import { AuthScreen } from 'screens/auth'

import { useAuthStore } from 'stores'

export interface RootStackParams extends ParamListBase {
	AuthScreen: undefined
	JoinScreen: undefined
	CallScreen: {
		roomId: string
		displayName: string
		enableVideo: boolean
		enableAudio: boolean
	}
}

export type MainStackParams = RootStackParams

const Stack = createNativeStackNavigator<RootStackParams>()

export const Navigation = () => {
	const token = useAuthStore((s) => s.accessToken)
	const { theme } = useUnistyles()

	const navigationTheme: Theme = useMemo(
		() => ({
			...DefaultTheme,
			colors: {
				...DefaultTheme.colors,
				background: theme.fill.page,
			},
		}),
		[theme.fill.page]
	)

	return (
		<NavigationContainer theme={navigationTheme}>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				{token ? (
					<Stack.Group screenOptions={{ animationTypeForReplace: 'push', animation: 'fade' }}>
						<Stack.Screen name="JoinScreen" component={JoinScreen} />
						<Stack.Screen name="CallScreen" component={CallScreen} options={{ animation: 'none' }} />
					</Stack.Group>
				) : (
					<Stack.Group screenOptions={{ animationTypeForReplace: 'push', animation: 'fade' }}>
						<Stack.Screen name="AuthScreen" component={AuthScreen} />
					</Stack.Group>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	)
}
