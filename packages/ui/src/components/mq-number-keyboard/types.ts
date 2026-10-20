export type MqNumberKeyboardMode = 'default' | 'custom'

export interface MqNumberKeyboardProps {
  modelValue?: string
  visible?: boolean
  mode?: MqNumberKeyboardMode
  extraKey?: string
  closeText?: string
  maxlength?: number
  randomKeyOrder?: boolean
  title?: string
}

export interface MqNumberKeyboardEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'update:visible', value: boolean): void
  (e: 'input', value: string): void
  (e: 'delete'): void
  (e: 'close'): void
}
