import { useCallback, useMemo, useState } from 'react'
import { type LayoutChangeEvent } from 'react-native'

import { Gesture } from 'react-native-gesture-handler'
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

const LOCAL_VIDEO_WIDTH = 120
const LOCAL_VIDEO_HEIGHT = 160
const LOCAL_VIDEO_MARGIN = 5

const clamp = (value: number, min: number, max: number) => {
	'worklet'

	return Math.max(min, Math.min(max, value))
}

export const useFloatingPreview = () => {
	const [videoContainerSize, setVideoContainerSize] = useState({ width: 0, height: 0 })
	const translateX = useSharedValue(0)
	const translateY = useSharedValue(0)
	const startX = useSharedValue(0)
	const startY = useSharedValue(0)

	const minX = 0
	const maxX = Math.max(0, videoContainerSize.width - (LOCAL_VIDEO_WIDTH + LOCAL_VIDEO_MARGIN * 2))
	const minY = 0
	const maxY = Math.max(0, videoContainerSize.height - (LOCAL_VIDEO_HEIGHT + LOCAL_VIDEO_MARGIN * 2))

	const resetPosition = useCallback(() => {
		translateX.set(0)
		translateY.set(0)
		startX.set(0)
		startY.set(0)
	}, [startX, startY, translateX, translateY])

	const localVideoGesture = useMemo(
		() =>
			Gesture.Pan()
				.minDistance(3)
				.onStart(() => {
					startX.set(translateX.get())
					startY.set(translateY.get())
				})
				.onUpdate((event) => {
					translateX.set(clamp(startX.get() + event.translationX, minX, maxX))
					translateY.set(clamp(startY.get() + event.translationY, minY, maxY))
				})
				.onEnd(() => {
					translateX.set(clamp(translateX.get(), minX, maxX))
					translateY.set(clamp(translateY.get(), minY, maxY))
				}),
		[maxX, maxY, minX, minY, startX, startY, translateX, translateY]
	)

	const localVideoAnimatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.get() }, { translateY: translateY.get() }],
	}))

	const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
		const { width, height } = event.nativeEvent.layout
		setVideoContainerSize({ width, height })
	}, [])

	return {
		localVideoWidth: LOCAL_VIDEO_WIDTH,
		localVideoHeight: LOCAL_VIDEO_HEIGHT,
		localVideoMargin: LOCAL_VIDEO_MARGIN,
		localVideoGesture,
		localVideoAnimatedStyle,
		handleContainerLayout,
		resetPosition,
	}
}
