import { useMutation, useQueryClient } from '@tanstack/react-query'

import { authService } from './auth-service'
import { stopAllActiveStreams } from 'app/webrtc/lifecycle'
import { secureStorage, useAuthStore } from 'stores'

interface LoginPayload {
	login: string
	password: string
	useMockAuth?: boolean
}

export const useSignIn = () => {
	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: async (payload: LoginPayload) => {
			if (payload.useMockAuth) {
				await new Promise<void>((resolve) => {
					setTimeout(resolve, 1000)
				})

				const access = `mock-access-${payload.login}-${Date.now().toString()}`
				const refresh = `mock-refresh-${payload.login}-${Date.now().toString()}`

				useAuthStore.getState().setTokens(access, refresh)
				await secureStorage.saveTokens(access, refresh)
				return
			}
			await authService.login(payload.login, payload.password)
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['auth'] })
		},
		retry: 0,
	})

	return {
		...mutation,
		signIn: mutation.mutate,
	}
}

type LogoutResponse = Promise<void>

export const useSignOut = () => {
	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: async (): LogoutResponse => {
			await stopAllActiveStreams()
			return authService.logout()
		},
		onSuccess: async () => {
			await queryClient.cancelQueries()

			queryClient.removeQueries({
				predicate: (q) => q.queryKey[0] !== 'public',
			})
		},
		retry: 0,
	})

	return {
		...mutation,
		signOut: mutation.mutate,
	}
}
