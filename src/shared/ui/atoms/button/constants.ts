import type { BodyVariant } from '../typography'
import type { ButtonSize } from './types'

export const TEXT_VARIANT_MAP: Record<ButtonSize, BodyVariant> = {
	sm: 'sm',
	md: 'base',
	lg: 'base',
}

export const LOADER_SIZE_MAP: Record<ButtonSize, number> = {
	sm: 16,
	md: 20,
	lg: 24,
}
