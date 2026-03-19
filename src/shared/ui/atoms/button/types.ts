import type { GestureResponderEvent, StyleProp, TextStyle, ViewStyle } from 'react-native'

export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonVariant = 'primary' | 'secondary'

export interface ButtonProps {
	text?: string
	onPress?: (event: GestureResponderEvent) => void
	leftSlot?: React.ReactNode | null
	rightSlot?: React.ReactNode | null
	size?: ButtonSize
	variant?: ButtonVariant
	disabled?: boolean
	loading?: boolean
	textStyle?: StyleProp<TextStyle>
	style?: StyleProp<ViewStyle>
}

export interface ColorableProps {
	color?: string
}
