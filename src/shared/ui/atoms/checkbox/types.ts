import type { StyleProp, ViewStyle } from 'react-native'

export interface CheckboxProps {
	value: boolean
	onValueChange: (value: boolean) => void
	label?: string
	errorText?: string
	description?: string
	indeterminate?: boolean
	disabled?: boolean
	invalid?: boolean
	style?: StyleProp<ViewStyle>
}
