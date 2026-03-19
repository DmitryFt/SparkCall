import { useCallback, useState } from 'react'
import { Pressable, View } from 'react-native'

import { Body } from '../typography'

import styles from './styles'
import type { RadioProps } from './types'

export const Radio = ({
	value,
	onValueChange,
	label,
	description,
	errorText,
	disabled = false,
	invalid = false,
	style,
}: Readonly<RadioProps>) => {
	const [focused, setFocused] = useState(false)

	const onlyLabel = !!label && !description && !errorText
	const hasText = Boolean((label ?? description ?? errorText) && (label !== '' || description !== '' || errorText !== ''))

	styles.useVariants({
		selected: value,
		disabled,
		focused,
		invalid,
		onlyLabel,
	})

	const handleFocus = useCallback(() => {
		setFocused(true)
	}, [])

	const handleBlur = useCallback(() => {
		setFocused(false)
	}, [])

	const handlePress = useCallback(() => {
		if (!disabled) onValueChange(!value)
	}, [disabled, onValueChange, value])

	return (
		<Pressable
			accessibilityLabel={label}
			accessibilityRole="radio"
			accessibilityState={{ checked: value, disabled }}
			disabled={disabled}
			style={[styles.container, style]}
			onPress={handlePress}
			onPressIn={handleFocus}
			onPressOut={handleBlur}
		>
			<View style={styles.radioContainer}>
				<View style={styles.radioInner} />
			</View>

			{hasText && (
				<View style={styles.textContainer}>
					{!!label && (
						<Body style={styles.labelText} variant="base-medium">
							{label}
						</Body>
					)}

					{!!description && (
						<Body style={styles.descriptionText} variant="base">
							{description}
						</Body>
					)}

					{!!errorText && (
						<Body style={styles.errorText} variant="base">
							{errorText}
						</Body>
					)}
				</View>
			)}
		</Pressable>
	)
}
