import { useCallback } from 'react'
import { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming, type WithTimingConfig } from 'react-native-reanimated'

const ROTATION_START = 0
const ROTATION_END = 360

const TIMING_CONFIG: WithTimingConfig = {
	duration: 1000,
	easing: Easing.linear,
}

export const useButtonAnimations = () => {
	const rotation = useSharedValue(ROTATION_START)

	const startAnimation = useCallback(() => {
		rotation.set(withRepeat(withTiming(ROTATION_END, TIMING_CONFIG), -1, false))
	}, [rotation])

	const stopAnimation = useCallback(() => {
		rotation.set(ROTATION_START)
	}, [rotation])

	const animatedStyle = useAnimatedStyle(() => {
		const rotateZ = `${rotation.get().toString()}deg`
		return {
			transform: [{ rotateZ }],
		}
	})

	return {
		animatedStyle,
		startAnimation,
		stopAnimation,
	}
}
