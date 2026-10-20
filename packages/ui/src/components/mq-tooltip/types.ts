export type MqTooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface MqTooltipProps {
  modelValue?: boolean
  content?: string
  placement?: MqTooltipPlacement
  disabled?: boolean
  showClose?: boolean
}

export interface MqTooltipEmits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}
