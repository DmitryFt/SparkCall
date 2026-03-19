import type { TextProps as RNTextProps } from 'react-native'

export type HeadingVariant = 'h1' | 'h2' | 'h3' | 'h4'

export interface HeadingProps extends RNTextProps {
	variant: HeadingVariant
}
