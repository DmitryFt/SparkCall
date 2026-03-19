import { StyleSheet } from 'react-native-unistyles'

// tokens
import { darkTheme } from '../theme/dark-theme'
import { lightTheme } from '../theme/light-theme'
import { breakpoints } from '../theme/breakpoints'

// types
export type AppTheme = typeof lightTheme

declare module 'react-native-unistyles' {
	interface UnistylesThemes {
		light: typeof lightTheme
		dark: typeof darkTheme
	}
	interface UnistylesBreakpoints {
		'xs': number
		'sm': number
		'md': number
		'lg': number
		'xl': number
		'2xl': number
	}
}

//----------------------------------------------------------
// Configure
//----------------------------------------------------------
StyleSheet.configure({
	themes: {
		light: lightTheme,
		dark: darkTheme,
	},
	breakpoints,
	settings: {
		initialTheme: 'light',
	},
})
