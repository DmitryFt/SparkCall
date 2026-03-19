import { StyleSheet } from 'react-native-unistyles'

export default StyleSheet.create((theme) => ({
	container: {
		justifyContent: 'center',

		variants: {
			size: {
				sm: {
					borderRadius: theme.sizes.radius.sm,
				},
				md: {
					borderRadius: theme.sizes.radius.md,
				},
				lg: {
					borderRadius: theme.sizes.radius.lg,
				},
			},
			variant: {
				primary: {
					backgroundColor: theme.button.primary,
				},
				secondary: {
					backgroundColor: theme.button.secondary,
				},
			},
			disabled: {
				true: {
					opacity: 0.5,
				},
			},
			withText: {
				true: {},
				false: {},
			},
		},

		compoundVariants: [
			{
				withText: true,
				size: 'sm',
				styles: {
					paddingVertical: theme.sizes.spacing.xs,
					paddingHorizontal: theme.sizes.spacing.md,
				},
			},
			{
				withText: true,
				size: 'md',
				styles: {
					paddingVertical: theme.sizes.spacing.md,
					paddingHorizontal: theme.sizes.spacing.lg,
				},
			},
			{
				withText: true,
				size: 'lg',
				styles: {
					paddingVertical: theme.sizes.spacing.md,
					paddingHorizontal: theme.sizes.spacing.lg,
				},
			},
			{
				withText: false,
				size: 'sm',
				styles: {
					padding: theme.sizes.spacing.sm,
				},
			},
			{
				withText: false,
				size: 'md',
				styles: {
					padding: theme.sizes.spacing.md,
				},
			},
			{
				withText: false,
				size: 'lg',
				styles: {
					padding: theme.sizes.spacing.lg,
				},
			},
		],
	},
	contentContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: theme.sizes.spacing.sm,

		variants: {
			withLoader: {
				true: {
					opacity: 0,
				},
			},
		},
	},
	pressed: {
		variants: {
			variant: {
				primary: {
					backgroundColor: theme.button.primary_pressed,
				},
				secondary: {
					backgroundColor: theme.button.secondary_pressed,
				},
			},
		},
	},
	text: {
		color: theme.static.light,
	},
	loaderContainer: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'center',
		alignItems: 'center',
	},
}))
