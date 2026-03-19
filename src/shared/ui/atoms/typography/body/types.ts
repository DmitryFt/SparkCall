import type { TextProps as RNTextProps } from 'react-native'

export type BodyVariant =
	| 'base'
	| 'base-medium'
	| 'base-semibold'
	| 'sm'
	| 'sm-medium'
	| 'sm-semibold'
	| 'xs'
	| 'xs-medium'
	| 'xs-semibold'

export interface BodyProps extends RNTextProps {
	variant: BodyVariant
}
