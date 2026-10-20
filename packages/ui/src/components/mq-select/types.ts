import type { MqSelectOption, MqSelectValue } from '../../utils/select'

export interface MqSelectProps {
  modelValue?: MqSelectValue
  visible?: boolean
  options?: MqSelectOption[]
  multiple?: boolean
  title?: string
  /** 搜索框占位文案。 */
  placeholder?: string
  searchable?: boolean
  cancelText?: string
  confirmText?: string
  maskClosable?: boolean
  zIndex?: number
  duration?: number
  safeArea?: boolean
}

export interface MqSelectPayload {
  value: MqSelectValue
}

export interface MqSelectEmits {
  (e: 'update:modelValue', value: MqSelectValue): void
  (e: 'update:visible', visible: boolean): void
  (e: 'change', payload: MqSelectPayload): void
  (e: 'confirm', payload: MqSelectPayload): void
  (e: 'cancel'): void
  (e: 'open'): void
  (e: 'close'): void
}

export interface MqSelectExpose {
  open: () => void
  close: () => void
}
