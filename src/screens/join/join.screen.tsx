import { useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Pressable, View } from 'react-native'

import { StyleSheet } from 'react-native-unistyles'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'

import styles from './styles'

import type { MainStackParams } from 'navigation'
import { useSignOut } from 'services/auth/use-auth'

import { Body, Button, Heading, Input, Switch } from 'shared/ui/atoms'

//----------------------------------------------------------
// JoinScreen
//----------------------------------------------------------
export const JoinScreen = () => {
	//navigation
	const navigation = useNavigation<NativeStackNavigationProp<MainStackParams>>()
	const { signOut, isPending: isSignOutPending } = useSignOut()

	//state
	const [roomId, setRoomId] = useState(() => `rn-${Date.now().toString(36)}`)
	const [displayName, setDisplayName] = useState('')
	const [isSubmitAttempted, setIsSubmitAttempted] = useState(false)
	const [isVideoEnabled, setIsVideoEnabled] = useState(true)
	const [isAudioEnabled, setIsAudioEnabled] = useState(true)

	const roomIdTrimmed = roomId.trim()
	const displayNameTrimmed = displayName.trim()

	const hasRoomError = isSubmitAttempted && roomIdTrimmed.length === 0
	const hasDisplayNameError = isSubmitAttempted && displayNameTrimmed.length === 0
	const canJoin = roomIdTrimmed.length > 0 && displayNameTrimmed.length > 0

	//callbacks
	const onJoinPress = (): void => {
		Keyboard.dismiss()
		setIsSubmitAttempted(true)

		if (!canJoin) {
			return
		}

		navigation.navigate('CallScreen', {
			roomId: roomIdTrimmed,
			displayName: displayNameTrimmed,
			enableVideo: isVideoEnabled,
			enableAudio: isAudioEnabled,
		})
	}

	const onSignOutPress = (): void => {
		signOut()
	}

	//render
	const roomDescription = hasRoomError ? 'Введите номер комнаты' : 'Номер комнаты для подключения'
	const displayNameDescription = hasDisplayNameError ? 'Введите имя' : 'Имя, которое увидят другие участники'

	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView keyboardVerticalOffset={0} style={styles.container} behavior="height">
				<Pressable style={StyleSheet.absoluteFill} onPress={Keyboard.dismiss} />

				<Heading variant="h1" style={styles.titleText}>
					Spark Call
				</Heading>

				<Body style={styles.subtitleText} variant="sm-medium">
					Введите номер комнаты и имя для звонка
				</Body>

				<Input
					value={roomId}
					onChangeText={setRoomId}
					autoCapitalize="none"
					autoCorrect={false}
					placeholder="Идентификатор комнаты"
					description={roomDescription}
					invalid={hasRoomError}
				/>

				<Input
					value={displayName}
					onChangeText={setDisplayName}
					autoCapitalize="words"
					autoCorrect={false}
					placeholder="Отображаемое имя"
					description={displayNameDescription}
					invalid={hasDisplayNameError}
				/>

				<Button
					style={{ marginTop: 20 }}
					text="Подключиться"
					disabled={!canJoin}
					variant="primary"
					onPress={onJoinPress}
				/>
			</KeyboardAvoidingView>

			<View style={styles.footer}>
				<View style={styles.switchContainer}>
					<Switch value={isVideoEnabled} onValueChange={setIsVideoEnabled} label="Подключить звук" />
				</View>

				<View style={styles.switchContainer}>
					<Switch value={isAudioEnabled} onValueChange={setIsAudioEnabled} label="Включить мое видео" />
				</View>

				<Button
					style={styles.signOutButton}
					text="Выйти из аккаунта"
					variant="secondary"
					size="sm"
					onPress={onSignOutPress}
					disabled={isSignOutPending}
					loading={isSignOutPending}
				/>
			</View>
		</SafeAreaView>
	)
}
