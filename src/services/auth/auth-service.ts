import { apiClient } from 'shared/api-client'
import { secureStorage, useAuthStore } from 'stores'

interface LoginResponse {
	accessToken: string
	refreshToken?: string
}

interface AuthTokens {
	access: string
	refresh: string | null
}

interface AuthService {
	login: (email: string, password: string) => Promise<AuthTokens>
	refresh: () => Promise<string>
	logout: () => Promise<void>
}

const persistTokens = async (access: string, refresh: string | null): Promise<void> => {
	useAuthStore.getState().setTokens(access, refresh)
	await secureStorage.saveTokens(access, refresh)
}

export const authService: AuthService = {
	async login(email: string, password: string): Promise<AuthTokens> {
		const { data } = await apiClient.post<LoginResponse>('/auth/login', {
			username: email,
			password,
			expiresInMins: 30,
		})

		const access = data.accessToken
		const refresh = data.refreshToken ?? null

		await persistTokens(access, refresh)

		return { access, refresh }
	},

	async refresh(): Promise<string> {
		const currentRefresh = useAuthStore.getState().refreshToken ?? (await secureStorage.getRefreshToken())

		if (!currentRefresh) {
			await this.logout()
			throw new Error('No refresh token')
		}

		try {
			const { data } = await apiClient.post<LoginResponse>('/auth/refresh', {
				refreshToken: currentRefresh,
				expiresInMins: 30,
			})

			const access = data.accessToken
			const rotatedRefresh = data.refreshToken ?? currentRefresh

			useAuthStore.getState().setTokens(access, rotatedRefresh)
			await secureStorage.saveTokens(access, rotatedRefresh)

			return access
		} catch (error) {
			await this.logout()
			throw error
		}
	},

	async logout(): Promise<void> {
		useAuthStore.getState().clear()
		await secureStorage.clearTokens()
	},
}
