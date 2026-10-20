import type { MqDatetimeFormatter, MqDatetimeType } from '../../utils/datetime'

export interface MqDatetimePickerBeforeConfirm {
  (value: string | number): boolean | Promise<boolean>
}

export interface MqDatetimePickerProps {
  /** `time` 类型用 `HH:mm(:ss)` 字符串，其余类型用时间戳。 */
  modelValue?: string | number
  visible?: boolean
  type?: MqDatetimeType
  title?: string
  cancelText?: string
  confirmText?: string
  maskClosable?: boolean
  safeArea?: boolean
  itemHeight?: number
  visibleItemCount?: number
  minDate?: number
  maxDate?: number
  minHour?: number
  maxHour?: number
  minMinute?: number
  maxMinute?: number
  useSecond?: boolean
  minSecond?: number
  maxSecond?: number
  formatter?: MqDatetimeFormatter
  beforeConfirm?: MqDatetimePickerBeforeConfirm
  zIndex?: number
  duration?: number
  immediateChange?: boolean
}

export interface MqDatetimeConfirmPayload {
  value: string | number
}

export interface MqDatetimePickerEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'update:visible', visible: boolean): void
  (e: 'confirm', payload: MqDatetimeConfirmPayload): void
  (e: 'change', payload: MqDatetimeConfirmPayload): void
  (e: 'cancel'): void
  (e: 'open'): void
  (e: 'close'): void
}
