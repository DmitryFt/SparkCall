import * as Keychain from 'react-native-keychain'

const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN'
const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN'
const TOKEN_USERNAME = 'token'

const getService = (key: string): string => `spark-call.auth.${key}`

export const secureStorage = {
	saveTokens: async (accessToken: string, refreshToken: string | null) => {
		await Keychain.setGenericPassword(TOKEN_USERNAME, accessToken, {
			service: getService(ACCESS_TOKEN_KEY),
		})
		if (refreshToken) {
			await Keychain.setGenericPassword(TOKEN_USERNAME, refreshToken, {
				service: getService(REFRESH_TOKEN_KEY),
			})
		}
	},

	getAccessToken: async (): Promise<string | null> => {
		const credentials = await Keychain.getGenericPassword({
			service: getService(ACCESS_TOKEN_KEY),
		})
		return credentials ? credentials.password : null
	},

	getRefreshToken: async (): Promise<string | null> => {
		const credentials = await Keychain.getGenericPassword({
			service: getService(REFRESH_TOKEN_KEY),
		})
		return credentials ? credentials.password : null
	},

	clearTokens: async () => {
		await Keychain.resetGenericPassword({
			service: getService(ACCESS_TOKEN_KEY),
		})
		await Keychain.resetGenericPassword({
			service: getService(REFRESH_TOKEN_KEY),
		})
	},

	saveAccessToken: async (accessToken: string) => {
		await Keychain.setGenericPassword(TOKEN_USERNAME, accessToken, {
			service: getService(ACCESS_TOKEN_KEY),
		})
	},

	hasToken: async (): Promise<boolean> => {
		const credentials = await Keychain.getGenericPassword({
			service: getService(ACCESS_TOKEN_KEY),
		})
		return credentials !== false && credentials.password.length > 0
	},
}
