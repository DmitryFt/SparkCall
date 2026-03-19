import { useCallback, useState } from 'react'

type Setter<T> = T | ((prev: T) => T)

interface UseControllableStateProps<T> {
	value?: T
	onChange?: (value: T) => void
	initialState?: T
}

export const useControllableState = <T>({ value, onChange, initialState }: UseControllableStateProps<T>) => {
	const [internalValue, setInternalValue] = useState<T | undefined>(initialState)

	const isControlled = value !== undefined
	const state = (isControlled ? value : internalValue) as T

	const setState = useCallback(
		(next: Setter<T>) => {
			const compute = (prev: T): T => (typeof next === 'function' ? (next as (prevValue: T) => T)(prev) : next)

			if (!isControlled) {
				setInternalValue((prev) => compute(prev as T))
			}
			onChange?.(compute(state))
		},
		[isControlled, onChange, state]
	)

	return [state, setState] as const
}
