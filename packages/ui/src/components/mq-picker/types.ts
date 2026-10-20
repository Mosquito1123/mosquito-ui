import type {
  MqPickerChangePayload,
  MqPickerColumns,
  MqPickerOption,
  MqPickerValue,
} from '../mq-picker-view/types'

export type { MqPickerChangePayload, MqPickerColumns, MqPickerOption, MqPickerValue }

export interface MqPickerConfirmPayload {
  value: MqPickerValue[]
  selectedItems: MqPickerOption[]
  selectedLabels: string[]
  selectedIndexes: number[]
}

export interface MqPickerProps {
  /** 选中值数组。 */
  modelValue?: MqPickerValue[]
  /** 弹出层显隐，配合 `v-model:visible`。 */
  visible?: boolean
  /** 一维数组为单列，二维数组为多列；`cascade` 时传入树。 */
  columns?: MqPickerColumns
  cascade?: boolean
  title?: string
  cancelText?: string
  confirmText?: string
  valueKey?: string
  labelKey?: string
  childrenKey?: string
  itemHeight?: number
  visibleItemCount?: number
  /** 确认前校验。返回 `false` 时留在面板里。 */
  beforeConfirm?: (
    value: MqPickerValue[],
    payload: MqPickerChangePayload,
  ) => boolean | Promise<boolean>
  maskClosable?: boolean
  zIndex?: number
  duration?: number
  /** 面板底部是否留安全区。 */
  safeArea?: boolean
  immediateChange?: boolean
}

export interface MqPickerEmits {
  'update:modelValue': [value: MqPickerValue[]]
  'update:visible': [value: boolean]
  confirm: [payload: MqPickerConfirmPayload]
  cancel: []
  open: []
  close: []
  change: [payload: MqPickerChangePayload]
}
