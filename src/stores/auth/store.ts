import { create } from 'zustand/index'

interface State {
	accessToken: string | null
	refreshToken: string | null
	setTokens: (access: string | null, refresh: string | null) => void
	clear: () => void
}

export const useAuthStore = create<State>((set) => ({
	accessToken: null,
	refreshToken: null,
	setTokens: (access, refresh) => {
		set({
			accessToken: access,
			refreshToken: refresh ?? null,
		})
	},
	clear: () => {
		set({ accessToken: null, refreshToken: null })
	},
}))
