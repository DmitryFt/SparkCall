import type { ReactNode } from 'react'
import type { StyleProp, ViewStyle } from 'react-native'

export interface ColorableProps {
	color?: string
}

export interface SwitchProps {
	value: boolean
	onValueChange?: (value: boolean) => void
	label?: string
	disabled?: boolean
	icon?: ReactNode
	style?: StyleProp<ViewStyle>
}
