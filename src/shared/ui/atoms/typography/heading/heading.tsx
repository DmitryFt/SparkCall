import { Text as RNText } from 'react-native'

import styles from './styles'
import type { HeadingProps } from './types'

export const Heading = ({ children, variant, style, ...rest }: HeadingProps) => {
	styles.useVariants({ variant })

	return (
		<RNText style={[styles.text, style]} {...rest}>
			{children}
		</RNText>
	)
}
