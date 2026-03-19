import type { ComponentProps } from 'react'
import type { ControllerProps, FieldValues } from 'react-hook-form'

import { Input } from '../../atoms/input/input'

type OmittedInputProps = Omit<ComponentProps<typeof Input>, 'value' | 'onChangeText' | 'onBlur'>
type PickedControllerProps<T extends FieldValues> = Pick<ControllerProps<T>, 'control' | 'name' | 'rules' | 'defaultValue'>

interface BaseProps {
	isInvalid?: boolean
	label?: string
	errorText?: string
	disabled?: boolean
	withBottomSheet?: boolean
}

export type InputFieldProps<T extends FieldValues> = BaseProps & OmittedInputProps & PickedControllerProps<T>
