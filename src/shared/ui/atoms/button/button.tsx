import { isValidElement, useEffect } from 'react'
import { Pressable, View, type PressableStateCallbackType, ActivityIndicator } from 'react-native'

import Animated from 'react-native-reanimated'
import { withUnistyles } from 'react-native-unistyles'

import { Body } from '../typography'
import styles from './styles'
import type { ButtonProps, ColorableProps } from './types'

import { useButtonAnimations } from './animations'
import { TEXT_VARIANT_MAP, LOADER_SIZE_MAP } from './constants'

export const Button = ({
	text,
	onPress,
	leftSlot,
	rightSlot,
	size = 'md',
	variant = 'primary',
	disabled = false,
	loading = false,
	textStyle,
	style,
}: Readonly<ButtonProps>) => {
	const buttonDisabled = disabled || loading
	const withLoader = loading
	const withText = !!text

	styles.useVariants({
		size,
		variant,
		disabled: buttonDisabled,
		withText,
		withLoader,
	})

	const { animatedStyle, startAnimation, stopAnimation } = useButtonAnimations()

	useEffect(() => {
		const isLoading = withLoader
		if (isLoading) startAnimation()
		else stopAnimation()
	}, [withLoader, startAnimation, stopAnimation])

	useEffect(() => {
		return () => {
			stopAnimation()
		}
	}, [stopAnimation])

	const renderSlot = (slot: React.ReactNode): React.ReactElement => {
		if (!isValidElement<ColorableProps>(slot)) {
			return <>{slot}</>
		}

		if (slot.props.color != null) {
			return slot
		}

		const Component = slot.type as React.ComponentType<ColorableProps>
		const UniSlot = withUnistyles(Component)

		return (
			<UniSlot
				{...slot.props}
				uniProps={() => ({
					color: styles.text.color,
				})}
			/>
		)
	}

	return (
		<Pressable
			accessibilityLabel={text}
			accessibilityRole="button"
			disabled={buttonDisabled}
			style={({ pressed }: PressableStateCallbackType) => [styles.container, pressed && styles.pressed, style]}
			accessibilityState={{
				disabled: buttonDisabled,
				busy: withLoader,
			}}
			onPress={onPress}
		>
			<View style={styles.contentContainer}>
				{!!leftSlot && renderSlot(leftSlot)}

				{withText && (
					<Body style={[styles.text, textStyle]} variant={TEXT_VARIANT_MAP[size]}>
						{text}
					</Body>
				)}

				{!!rightSlot && renderSlot(rightSlot)}
			</View>

			{withLoader && (
				<Animated.View style={[styles.loaderContainer, animatedStyle]}>
					<ActivityIndicator color={styles.text.color} size={LOADER_SIZE_MAP[size]} />
				</Animated.View>
			)}
		</Pressable>
	)
}
