import { secureStorage, useAuthStore } from 'stores'
import { useHydrateStore } from 'stores/auth/hydrate-store'

export const hydrateAuth = async (): Promise<void> => {
	const [access, refresh] = await Promise.all([secureStorage.getAccessToken(), secureStorage.getRefreshToken()])

	useAuthStore.getState().setTokens(access, refresh)
	useHydrateStore.getState().setHydrated(true)
}
