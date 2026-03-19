import { useCallback, useMemo } from 'react'
import { TextInput, type TextInputProps, View, Pressable } from 'react-native'

import { withUnistyles } from 'react-native-unistyles'
import { useAnimatedVariantColor } from 'react-native-unistyles/reanimated'
import Animated, { Easing, useAnimatedStyle, withTiming, type WithTimingConfig } from 'react-native-reanimated'

import { Body } from '../typography'

import { useControllableState } from '../../../hooks'
import styles from './styles'
import type { InputProps } from './types'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const UniTextInput = withUnistyles(TextInput, (theme) => ({
	placeholderTextColor: theme.input.placeholder,
	cursorColor: theme.input.text,
}))

const TIMING_CONFIG: WithTimingConfig = {
	duration: 150,
	easing: Easing.ease,
}

export const Input = ({
	onChangeText,
	onFocus,
	onBlur,
	onContentPress,
	focused: focusedProp,
	onFocusedChange,
	label = '',
	description = '',
	disabled = false,
	editable = true,
	required = false,
	invalid = false,
	value,
	ref,
	style,
	contentStyle,
	...rest
}: Readonly<InputProps & { ref?: React.RefObject<TextInput | null> }>) => {
	const [focused, setFocused] = useControllableState<boolean>({
		initialState: false,
		...(focusedProp !== undefined && { value: focusedProp }),
		...(onFocusedChange !== undefined && { onChange: onFocusedChange }),
	})

	const borderVariant = useMemo(() => {
		if (disabled) return 'disabled'
		if (invalid) return 'invalid'
		if (focused) return 'focused'
		return undefined
	}, [disabled, invalid, focused])

	styles.useVariants({
		invalid,
		disabled,
		borderVariant,
	})

	const borderColor = useAnimatedVariantColor(styles.contentColor, 'borderColor')

	const animatedContentStyle = useAnimatedStyle(() => ({
		borderColor: withTiming(borderColor.value, TIMING_CONFIG),
	}))

	const handleFocus = useCallback<NonNullable<TextInputProps['onFocus']>>(
		(event) => {
			setFocused(true)
			onFocus?.(event)
		},
		[onFocus, setFocused]
	)

	const handleBlur = useCallback<NonNullable<TextInputProps['onBlur']>>(
		(event) => {
			setFocused(false)
			onBlur?.(event)
		},
		[onBlur, setFocused]
	)

	const isEditable = !disabled && editable

	const commonProps: TextInputProps & { ref?: React.RefObject<TextInput | null> } = {
		editable: isEditable,
		style: styles.input,
		onBlur: handleBlur,
		onFocus: handleFocus,
		onChangeText: onChangeText,
		selectTextOnFocus: false,
		maxFontSizeMultiplier: 1,
		allowFontScaling: false,
		textAlignVertical: 'center',
		accessibilityState: {
			disabled: !isEditable,
		},
		accessibilityLabel: label,
		...(value === undefined ? {} : { value }),
		...(ref === undefined ? {} : { ref }),
	}

	return (
		<View style={[styles.container, style]}>
			{!!label && (
				<View style={styles.labelContainer}>
					<Body style={styles.labelText} variant="sm-medium">
						{label}
					</Body>

					{required && (
						<Body style={styles.requiredText} variant="sm-medium">
							*
						</Body>
					)}
				</View>
			)}

			<AnimatedPressable
				disabled={disabled}
				style={[styles.contentContainer, animatedContentStyle, contentStyle]}
				onPress={onContentPress}
			>
				<View style={styles.inputContainer}>
					<UniTextInput {...rest} {...commonProps} />
				</View>
			</AnimatedPressable>

			{!!description && (
				<Body style={styles.descriptionText} variant="xs">
					{description}
				</Body>
			)}
		</View>
	)
}
