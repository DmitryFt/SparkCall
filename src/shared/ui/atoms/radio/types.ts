import type { StyleProp, ViewStyle } from 'react-native'

export interface RadioProps {
	value: boolean
	onValueChange: (value: boolean) => void
	label?: string
	description?: string
	errorText?: string
	disabled?: boolean
	invalid?: boolean
	style?: StyleProp<ViewStyle>
}
