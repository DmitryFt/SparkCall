import { create } from 'zustand'

interface State {
	hydrated: boolean
	setHydrated: (value: boolean) => void
}

export const useHydrateStore = create<State>((set) => ({
	hydrated: false,
	setHydrated: (value) => {
		set({ hydrated: value })
	},
}))
