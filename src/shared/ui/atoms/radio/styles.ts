import { StyleSheet } from 'react-native-unistyles'

export default StyleSheet.create((theme) => ({
	container: {
		alignItems: 'flex-start',
		flexDirection: 'row',
		gap: theme.sizes.spacing.md,
	},
	radioContainer: {
		width: 16,
		height: 16,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: theme.radio.uncheckedBorder,

		variants: {
			onlyLabel: {
				true: {
					marginTop: 0,
					alignSelf: 'center',
				},
				false: {
					marginTop: theme.sizes.spacing.xs,
					alignSelf: 'flex-start',
				},
			},
			focused: {
				true: {
					borderWidth: 2,
					borderColor: theme.radio.focusBorder,
					boxShadow: [
						{
							offsetX: 0,
							offsetY: 0,
							blurRadius: 0,
							spreadDistance: 3,
							color: theme.radio.focusRing,
							inset: false,
						},
						{
							offsetX: 0,
							offsetY: 0,
							blurRadius: 0,
							spreadDistance: 0.5,
							color: theme.radio.focusInnerRing,
							inset: false,
						},
					],
				},
			},
			selected: {
				true: {
					borderWidth: 0.5,
					borderColor: theme.radio.selectedBorder,
					backgroundColor: theme.radio.selectedBg,
				},
			},
			invalid: {
				true: {
					borderColor: theme.input.borderInvalid,
				},
			},
		},
		compoundVariants: [
			{
				selected: true,
				invalid: true,
				styles: {
					borderWidth: 0.5,
					borderColor: theme.input.borderInvalid,
				},
			},
			{
				selected: true,
				disabled: true,
				styles: {
					borderWidth: 0.5,
					borderColor: theme.radio.disabledSelectedBorder,
					backgroundColor: theme.radio.disabledSelectedBg,
				},
			},
		],
	},
	radioInner: {
		backgroundColor: theme.radio.dot,
		boxShadow: [
			{
				offsetX: 0,
				offsetY: 1,
				blurRadius: 2,
				spreadDistance: 0,
				color: theme.radio.focusInnerRing,
				inset: false,
			},
		],

		variants: {
			selected: {
				true: {
					width: 6,
					height: 6,
					borderRadius: 3,
				},
			},
			disabled: {
				true: {
					width: 6,
					height: 6,
					borderRadius: 3,
				},
			},
		},
		compoundVariants: [
			{
				selected: true,
				focused: true,
				styles: {
					width: 8,
					height: 8,
					borderRadius: 4,
				},
			},
		],
	},
	textContainer: {
		flexShrink: 1,
		alignItems: 'flex-start',

		variants: {
			disabled: {
				true: {
					opacity: 0.5,
				},
			},
		},
	},
	labelText: {
		color: theme.text.main,
	},
	descriptionText: {
		color: theme.text.secondary,
	},
	errorText: {
		color: theme.input.borderInvalid,
	},
}))
