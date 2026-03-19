import { StyleSheet } from 'react-native-unistyles'

export default StyleSheet.create((theme) => ({
	text: {
		variants: {
			variant: {
				'base': theme.typography.body.base,
				'base-medium': theme.typography.body['base-medium'],
				'base-semibold': theme.typography.body['base-semibold'],
				'sm': theme.typography.body.sm,
				'sm-medium': theme.typography.body['sm-medium'],
				'sm-semibold': theme.typography.body['sm-semibold'],
				'xs': theme.typography.body.xs,
				'xs-medium': theme.typography.body['xs-medium'],
				'xs-semibold': theme.typography.body['xs-semibold'],
			},
		},
	},
}))
