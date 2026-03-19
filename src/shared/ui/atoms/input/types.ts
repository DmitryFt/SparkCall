import type { StyleProp, ViewStyle, TextInputProps } from 'react-native'

interface BaseComponentProps {
	onContentPress?: () => void
	focused?: boolean
	onFocusedChange?: (focused: boolean) => void
	label?: string
	description?: string
	required?: boolean
	disabled?: boolean
	invalid?: boolean
	style?: StyleProp<ViewStyle>
	contentStyle?: StyleProp<ViewStyle>
}

type OmittedTextInputProps = Omit<TextInputProps, 'style' | 'containerStyle' | 'onPress'>

export type InputProps = OmittedTextInputProps & BaseComponentProps
