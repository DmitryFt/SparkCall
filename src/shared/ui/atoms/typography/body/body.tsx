import { Text as RNText } from 'react-native'

import styles from './styles'
import type { BodyProps } from './types'

export const Body = ({ children, variant, style, ...rest }: Readonly<BodyProps>) => {
	styles.useVariants({ variant })

	return (
		<RNText style={[styles.text, style]} {...rest}>
			{children}
		</RNText>
	)
}
