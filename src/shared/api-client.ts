import axios, { type AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'

import { useAuthStore } from '../stores'
import { authService } from '../services/auth/auth-service'

const apiClient = axios.create({
	baseURL: 'https://dummyjson.com',
})

apiClient.interceptors.request.use((config) => {
	const token = useAuthStore.getState().accessToken
	if (token) {
		config.headers = AxiosHeaders.from(config.headers)
		config.headers.set('Authorization', `Bearer ${token}`)
	}
	return config
})

const retried = new WeakSet<InternalAxiosRequestConfig>()

const isAuthUrl = (url: string) => url.includes('/auth/login') || url.includes('/auth/refresh')

let refreshing: Promise<string> | null = null

apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const original = error.config
		if (!original) throw error

		if (isAuthUrl(original.url ?? '') || retried.has(original)) throw error

		if (error.response?.status === 401) {
			retried.add(original)

			refreshing =
				refreshing ??
				authService.refresh().finally(() => {
					refreshing = null
				})
			const newAccess = await refreshing

			original.headers = AxiosHeaders.from(original.headers)
			original.headers.set('Authorization', `Bearer ${newAccess}`)

			return apiClient(original)
		}

		throw error
	}
)

export { apiClient }
