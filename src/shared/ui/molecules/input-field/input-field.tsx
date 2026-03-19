import { Controller, type FieldValues } from 'react-hook-form'

import { Input } from '../../atoms/input'

import type { InputFieldProps } from './types'

export function InputField<T extends FieldValues>({ control, name, rules, defaultValue, ...rest }: Readonly<InputFieldProps<T>>) {
	return (
		<Controller
			name={name}
			{...(control === undefined ? {} : { control })}
			{...(defaultValue === undefined ? {} : { defaultValue })}
			{...(rules === undefined ? {} : { rules })}
			render={({ field: { value, onChange, onBlur }, fieldState }) => (
				<Input
					invalid={!!fieldState.error}
					value={value}
					onBlur={onBlur}
					onChangeText={onChange}
					{...(fieldState.error?.message === undefined ? {} : { description: fieldState.error.message })}
					{...rest}
				/>
			)}
		/>
	)
}
