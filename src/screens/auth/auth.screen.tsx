import { useState } from 'react'
import { Keyboard, View, KeyboardAvoidingView, Pressable } from 'react-native'

import { isAxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { SafeAreaView } from 'react-native-safe-area-context'

import styles from './styles'

import { InputField } from 'shared/ui/molecules'
import { Body, Button, Heading, Switch } from 'shared/ui/atoms'

import { useSignIn } from 'services/auth/use-auth'

interface LoginFormData {
	login: string
	password: string
}

//----------------------------------------------------------
// AuthScreen
//----------------------------------------------------------
export const AuthScreen = () => {
	//state
	const [isChecked, setIsChecked] = useState(true)

	//form
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		defaultValues: { login: '', password: '' },
	})

	const { signIn, isPending, isError, error, reset } = useSignIn()

	const authErrorMessage: string = (() => {
		if (!isError) {
			return ''
		}

		if (isAxiosError(error)) {
			const responseData: unknown = error.response?.data

			if (typeof responseData === 'string' && responseData.length > 0) {
				return responseData
			}

			if (
				typeof responseData === 'object' &&
				responseData !== null &&
				'message' in responseData &&
				typeof responseData.message === 'string'
			) {
				const message = responseData.message
				if (typeof message === 'string' && message.length > 0) {
					return message
				}
			}
		}

		if (error instanceof Error && error.message.length > 0) {
			return error.message
		}

		return 'Не удалось выполнить вход. Проверьте логин и пароль.'
	})()

	//callbacks
	const onSubmit = ({ login, password }: LoginFormData) => {
		reset()
		signIn({ login, password, useMockAuth: isChecked })
	}

	const onLogin = () => {
		Keyboard.dismiss()
		void handleSubmit(onSubmit)()
	}

	//render
	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView keyboardVerticalOffset={0} style={styles.container} behavior="padding">
				<Pressable style={styles.overlay} onPress={Keyboard.dismiss} />

				<View style={styles.content}>
					<Heading variant="h1" style={styles.titleText}>
						Spark Call
					</Heading>

					<Body style={styles.subtitleText} variant="sm-medium">
						Введите логин и пароль для входа в систему
					</Body>

					<InputField
						autoCapitalize="none"
						name="login"
						control={control}
						placeholder="Логин"
						rules={{ required: 'Логин должен быть заполнен' }}
						autoCorrect={false}
						{...(!errors.login && { description: 'Логин для входа в систему' })}
					/>

					<InputField
						autoCapitalize="none"
						name="password"
						control={control}
						placeholder="Пароль"
						rules={{ required: 'Пароль должен быть заполнен' }}
						autoCorrect={false}
						{...(!errors.password && { description: 'Пароль для входа в систему' })}
					/>

					<Button
						size="lg"
						text="Войти"
						variant="primary"
						onPress={onLogin}
						loading={isPending}
						disabled={isPending}
						style={styles.action}
					/>

					{!!authErrorMessage && (
						<Body variant="sm-medium" style={styles.authErrorText}>
							{authErrorMessage}
						</Body>
					)}
				</View>
			</KeyboardAvoidingView>

			<View style={styles.footer}>
				<Switch value={isChecked} onValueChange={setIsChecked} label="Использовать моковый запрос" />
			</View>
		</SafeAreaView>
	)
}
