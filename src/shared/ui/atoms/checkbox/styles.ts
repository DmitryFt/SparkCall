import { StyleSheet } from 'react-native-unistyles'

const CHECKBOX_SIZE = 16

export default StyleSheet.create((theme) => ({
	container: {
		alignItems: 'flex-start',
		flexDirection: 'row-reverse',
		justifyContent: 'space-between',
		gap: theme.sizes.spacing.md,

		variants: {
			disabled: {
				true: {
					opacity: 0.5,
				},
			},
		},
	},
	checkboxContainer: {
		paddingTop: 1,
	},
	checkbox: {
		width: CHECKBOX_SIZE,
		height: CHECKBOX_SIZE,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 5,
		borderWidth: 1,
		boxShadow: [
			{
				offsetX: 0,
				offsetY: 1,
				blurRadius: 2,
				spreadDistance: 0,
				color: theme.checkbox.focusBorder,
				inset: false,
			},
		],

		variants: {
			checked: {
				true: {
					backgroundColor: theme.checkbox.checkedBg,
					borderColor: theme.checkbox.checkedBorder,
				},
				false: {
					backgroundColor: theme.checkbox.uncheckedBg,
					borderColor: theme.checkbox.uncheckedBorder,
				},
			},
			invalid: {
				true: {
					borderColor: theme.input.borderInvalid,
				},
				false: {},
			},
			focused: {
				true: {
					boxShadow: [
						{
							offsetX: 0,
							offsetY: 0,
							blurRadius: 0,
							spreadDistance: 3,
							color: theme.checkbox.focusRing,
							inset: false,
						},
						{
							offsetX: 0,
							offsetY: 0,
							blurRadius: 0,
							spreadDistance: 0.5,
							color: theme.checkbox.focusBorder,
							inset: false,
						},
					],
				},
				false: {},
			},
		},
		compoundVariants: [
			{
				checked: true,
				invalid: true,
				styles: {
					backgroundColor: theme.input.borderInvalid,
				},
			},
		],
	},
	iconContainer: {
		width: CHECKBOX_SIZE,
		height: CHECKBOX_SIZE,
		alignItems: 'center',
		justifyContent: 'center',
	},
	icon: {
		color: theme.checkbox.icon,
	},
	textContainer: {
		flexShrink: 1,
		alignItems: 'flex-start',
		gap: 2,
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
