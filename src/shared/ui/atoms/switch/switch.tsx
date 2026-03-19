import { isValidElement, useEffect, type ComponentType, type ReactNode } from 'react'
import { Pressable, View } from 'react-native'

import { withUnistyles } from 'react-native-unistyles'
import Animated, { useAnimatedStyle, useSharedValue, withTiming, type WithTimingConfig } from 'react-native-reanimated'

import { Body } from '../typography'
import styles, { THUMB_TRANSLATE_X } from './styles'
import type { SwitchProps, ColorableProps } from './types'

const TIMING_CONFIG: WithTimingConfig = {
	duration: 200,
}

export const Switch = ({ value, onValueChange, label, disabled, icon, style }: Readonly<SwitchProps>) => {
	styles.useVariants({ value, disabled })

	const translateX = useSharedValue(value ? THUMB_TRANSLATE_X : 0)

	const renderSlot = (slot: ReactNode) => {
		if (!isValidElement<ColorableProps>(slot)) {
			return <>{slot}</>
		}

		if (slot.props.color != null) {
			return slot
		}

		const Component = slot.type as ComponentType<ColorableProps>
		const UniSlot = withUnistyles(Component, (theme) => ({
			color: theme.switch.icon,
		}))

		return <UniSlot {...slot.props} />
	}

	useEffect(() => {
		translateX.set(withTiming(value ? THUMB_TRANSLATE_X : 0, TIMING_CONFIG))
	}, [value, translateX])

	const thumbAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.get() }],
	}))

	const handlePress = () => {
		if (!disabled && onValueChange) {
			onValueChange(!value)
		}
	}

	return (
		<Pressable
			accessibilityRole="switch"
			accessibilityState={{ checked: value, disabled }}
			disabled={disabled}
			style={({ pressed }) => [styles.container, pressed && !disabled && styles.pressed, style]}
			onPress={handlePress}
		>
			{!!label && (
				<Body variant="sm" style={styles.labelText}>
					{label}
				</Body>
			)}

			<View style={styles.track}>
				{disabled && <View pointerEvents="none" style={[styles.track, styles.disabledOverlay]} />}

				<Animated.View style={[styles.thumb, thumbAnimatedStyle]}>
					<View style={styles.thumbContent}>{renderSlot(icon)}</View>
				</Animated.View>
			</View>
		</Pressable>
	)
}
