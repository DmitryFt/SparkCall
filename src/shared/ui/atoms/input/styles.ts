import { StyleSheet } from 'react-native-unistyles'

export default StyleSheet.create((theme) => {
	return {
		container: {
			width: '100%',
			gap: theme.sizes.spacing.xs,
		},
		labelContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: theme.sizes.spacing.xs,
		},
		labelText: {
			variants: {
				invalid: {
					true: {
						color: theme.input.labelInvalid,
					},
					false: {
						color: theme.input.label,
					},
				},
			},
		},
		requiredText: {
			color: theme.input.labelInvalid,
		},
		contentColor: {
			variants: {
				borderVariant: {
					focused: {
						borderColor: theme.input.borderFocused,
					},
					disabled: {
						borderColor: theme.input.borderDisabled,
					},
					invalid: {
						borderColor: theme.input.borderInvalid,
					},
					default: {
						borderColor: theme.input.borderDefault,
					},
				},
			},
		},
		contentContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			paddingHorizontal: theme.sizes.spacing.sm,
			borderRadius: theme.sizes.radius.lg,
			backgroundColor: theme.input.background,
			borderWidth: 1,
			elevation: 1,

			variants: {
				disabled: {
					true: {
						opacity: 0.5,
					},
				},
			},
		},
		divider: (orientation: 'leading' | 'trailing') => ({
			width: 1,
			height: '100%',
			backgroundColor: theme.input.divider,
			marginRight: orientation === 'leading' ? theme.sizes.spacing.sm : 0,
			marginLeft: orientation === 'trailing' ? theme.sizes.spacing.sm : 0,
		}),
		inputContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			flex: 1,
		},
		input: {
			flex: 1,
			paddingVertical: theme.sizes.spacing.md,
			paddingHorizontal: theme.sizes.spacing.sm,
			color: theme.input.text,
			fontFamily: 'Inter',
			fontSize: 16,
			lineHeight: 20,
			fontWeight: 400,
			letterSpacing: 0,
			includeFontPadding: false,
			textAlignVertical: 'center',
		},
		descriptionText: {
			variants: {
				invalid: {
					true: {
						color: theme.input.borderInvalid,
					},
					false: {
						color: theme.input.label,
					},
				},
				disabled: {
					true: {
						opacity: 0.5,
					},
				},
			},
		},
	}
})
