import { useCallback, useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'

import { IconCheck, IconMinus } from '@tabler/icons-react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming, type WithTimingConfig } from 'react-native-reanimated'

import { Body } from '../typography'

import styles from './styles'
import type { CheckboxProps } from './types'

const ICON_SIZE = 12

const TIMING_CONFIG: WithTimingConfig = {
	duration: 200,
}

export const Checkbox = ({
	value,
	onValueChange,
	label,
	description,
	errorText,
	indeterminate = false,
	disabled = false,
	invalid = false,
	style,
}: Readonly<CheckboxProps>) => {
	const [focused, setFocused] = useState(false)

	const handleFocus = useCallback(() => {
		setFocused(true)
	}, [])

	const handleBlur = useCallback(() => {
		setFocused(false)
	}, [])

	const isChecked = value
	const showIcon = isChecked

	styles.useVariants({
		checked: isChecked,
		disabled,
		invalid,
		focused,
	})

	const scaleValue = showIcon ? 1 : 0
	const scale = useSharedValue(scaleValue)

	useEffect(() => {
		scale.set(withTiming(scaleValue, TIMING_CONFIG))
	}, [scaleValue, scale])

	const iconAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.get() }],
		opacity: scale.get(),
	}))

	const handlePress = () => {
		if (disabled) return
		onValueChange(!value)
	}

	const hasText = !!(label ?? description ?? errorText)

	const renderIcon = () => {
		if (!isChecked) return null

		const IconComponent = indeterminate ? IconMinus : IconCheck

		return <IconComponent color={styles.icon.color} size={ICON_SIZE} />
	}

	return (
		<Pressable
			accessibilityLabel={label}
			accessibilityRole="checkbox"
			accessibilityState={{ checked: value, disabled }}
			disabled={disabled}
			style={[styles.container, style]}
			onPress={handlePress}
			onPressIn={handleFocus}
			onPressOut={handleBlur}
		>
			<View style={styles.checkboxContainer}>
				<View style={styles.checkbox}>
					<Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>{renderIcon()}</Animated.View>
				</View>
			</View>

			{hasText && (
				<View style={styles.textContainer}>
					{label && (
						<Body style={styles.labelText} variant="sm-medium">
							{label}
						</Body>
					)}

					{description && (
						<Body style={styles.descriptionText} variant="sm">
							{description}
						</Body>
					)}

					{errorText && (
						<Body style={styles.errorText} variant="xs">
							{errorText}
						</Body>
					)}
				</View>
			)}
		</Pressable>
	)
}
