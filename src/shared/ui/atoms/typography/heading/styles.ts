import { StyleSheet } from 'react-native-unistyles'

export default StyleSheet.create((theme) => ({
	text: {
		variants: {
			variant: {
				h1: theme.typography.heading.h1,
				h2: theme.typography.heading.h2,
				h3: theme.typography.heading.h3,
				h4: theme.typography.heading.h4,
			},
		},
	},
}))
