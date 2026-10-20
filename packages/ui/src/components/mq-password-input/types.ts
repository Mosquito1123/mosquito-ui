export interface MqPasswordInputProps {
  modelValue?: string
  mask?: boolean
  info?: string
  errorInfo?: string
  gutter?: number | string
  length?: number
  focused?: boolean
}

export interface MqPasswordInputEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'focus', event: Event): void
}
