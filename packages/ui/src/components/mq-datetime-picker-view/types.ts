import type { MqPickerOption } from '../../utils/picker'
import type {
  MqDatetimeFormatter,
  MqDatetimeOptions,
  MqDatetimeType,
} from '../../utils/datetime'

export interface MqDatetimePickerViewProps {
  /** `time` 类型用 `HH:mm(:ss)` 字符串，其余类型用时间戳。 */
  modelValue?: string | number
  type?: MqDatetimeType
  itemHeight?: number
  visibleItemCount?: number
  formatter?: MqDatetimeFormatter
  minDate?: number
  maxDate?: number
  minHour?: number
  maxHour?: number
  minMinute?: number
  maxMinute?: number
  useSecond?: boolean
  minSecond?: number
  maxSecond?: number
  immediateChange?: boolean
}

export interface MqDatetimeChangePayload {
  value: string | number
  columns: MqPickerOption[][]
}

export interface MqDatetimePickerViewEmits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', payload: MqDatetimeChangePayload): void
  (e: 'pickstart'): void
  (e: 'pickend'): void
}

export interface MqDatetimePickerViewExpose {
  getSelectedOptions: () => MqPickerOption[]
  getOriginColumns: () => MqPickerOption[][]
  correctValue: (value: string | number) => string | number
}

export type MqDatetimePickerViewOptions = MqDatetimeOptions
