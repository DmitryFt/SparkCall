import { useCallback, useEffect, useState } from 'react'
import { NativeModules, Platform, Pressable, ScrollView, View } from 'react-native'

import { RTCView } from 'react-native-webrtc'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureDetector } from 'react-native-gesture-handler'
import Animated, { FadingTransition } from 'react-native-reanimated'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useCallSession } from './use-call-session'
import { useFloatingPreview } from './use-floating-preview'

import styles from './styles'
import { STATUS_LABELS } from './constants'

import type { MainStackParams } from 'navigation'
import { Body, Button, Heading, Switch } from 'shared/ui/atoms'

interface PipControlModule {
	setCallPipEnabled: (enabled: boolean) => void
}

type CallScreenProps = NativeStackScreenProps<MainStackParams, 'CallScreen'>

//----------------------------------------------------------
// CallScreen
//----------------------------------------------------------
export const CallScreen = ({ route, navigation }: CallScreenProps) => {
	//navigation
	const { roomId, displayName, enableVideo, enableAudio } = route.params

	//state
	const [isStreamsSwapped, setIsStreamsSwapped] = useState(false)
	const [isLogEnabled, setIsLogEnabled] = useState(false)

	//hooks & handlers
	const {
		localVideoWidth,
		localVideoHeight,
		localVideoMargin,
		localVideoGesture,
		localVideoAnimatedStyle,
		handleContainerLayout,
		resetPosition,
	} = useFloatingPreview()

	const handleSessionReset = useCallback(() => {
		resetPosition()
		setIsStreamsSwapped(false)
	}, [resetPosition])

	const { status, localStreamUrl, remoteStreamUrl, isVideoEnabled, remoteVideoKey, debugLines, endCall } = useCallSession({
		roomId,
		displayName,
		enableVideo,
		enableAudio,
		onSessionReset: handleSessionReset,
	})

	const handleSwapStreams = useCallback(() => {
		if (!localStreamUrl || !remoteStreamUrl) {
			return
		}

		setIsStreamsSwapped((prev) => !prev)
	}, [localStreamUrl, remoteStreamUrl])

	const handleDisconnectPress = (): void => {
		endCall()
			.catch(() => undefined)
			.finally(() => {
				navigation.goBack()
			})
	}

	//render
	const mainStreamUrl = isStreamsSwapped ? localStreamUrl : remoteStreamUrl
	const smallStreamUrl = isStreamsSwapped ? remoteStreamUrl : localStreamUrl
	const isMainLocal = isStreamsSwapped
	const isSmallLocal = !isStreamsSwapped
	const shouldShowSmallVideo = !!smallStreamUrl && (!isSmallLocal || isVideoEnabled)
	const statusLabel = STATUS_LABELS[status] ?? status

	const canStartPip = Platform.OS === 'android' && status === 'connected' && !!mainStreamUrl

	useEffect(() => {
		if (Platform.OS !== 'android') {
			return
		}

		const pipControlModule = NativeModules['PipControlModule'] as PipControlModule | undefined

		pipControlModule?.setCallPipEnabled(canStartPip)

		return () => pipControlModule?.setCallPipEnabled(false)
	}, [canStartPip])

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<Heading variant="h2" style={styles.roomText}>
					Комната {roomId}
				</Heading>

				<View style={styles.header}>
					<Body style={styles.participantText} variant="sm-medium">
						Вы: {displayName}
					</Body>

					<Body style={styles.statusText} variant="sm-medium">
						Статус: {statusLabel}
					</Body>
				</View>

				<View style={styles.switchContainer}>
					<Switch value={isLogEnabled} onValueChange={setIsLogEnabled} label="Показывать логи" />
				</View>

				{isLogEnabled && debugLines.length > 0 && (
					<Animated.View style={styles.logs} layout={FadingTransition}>
						<Body style={styles.logsTitle} variant="xs-semibold">
							Логи подключения
						</Body>

						<ScrollView style={styles.logsScrollContainer} contentContainerStyle={styles.logsScrollContent}>
							<Body style={styles.logsValue} variant="xs">
								{debugLines.join('\n')}
							</Body>
						</ScrollView>
					</Animated.View>
				)}

				<View style={styles.videoContainer} onLayout={handleContainerLayout}>
					{mainStreamUrl ? (
						<RTCView
							key={isMainLocal ? 'local-main' : `remote-main-${remoteVideoKey.toString()}`}
							streamURL={mainStreamUrl}
							style={styles.remoteVideo}
							mirror={isMainLocal}
							objectFit="cover"
							zOrder={1}
							pictureInPictureEnabled={!isMainLocal}
							autoStartPictureInPicture
							autoStopPictureInPicture
							pictureInPicturePreferredSize={{
								width: 150,
								height: 190,
							}}
						/>
					) : (
						<View style={styles.videoPlaceholder}>
							<Body style={styles.videoPlaceholderLabel} variant="sm-medium">
								Ожидание участника
							</Body>
						</View>
					)}

					{shouldShowSmallVideo && (
						<GestureDetector gesture={localVideoGesture}>
							<Animated.View
								style={[
									styles.localVideoWrapper,
									{
										width: localVideoWidth,
										height: localVideoHeight,
										left: localVideoMargin,
										top: localVideoMargin,
									},
									localVideoAnimatedStyle,
								]}
							>
								<RTCView
									key={isSmallLocal ? 'local-small' : `remote-small-${remoteVideoKey.toString()}`}
									streamURL={smallStreamUrl}
									style={styles.localVideo}
									mirror={isSmallLocal}
									objectFit="cover"
									zOrder={2}
								/>

								<Pressable style={styles.localVideoTapArea} onPress={handleSwapStreams} />
							</Animated.View>
						</GestureDetector>
					)}
				</View>

				<View style={styles.actions}>
					<Button
						text="Завершить звонок"
						variant="primary"
						onPress={handleDisconnectPress}
						style={styles.actionButton}
					/>
				</View>
			</View>
		</SafeAreaView>
	)
}
