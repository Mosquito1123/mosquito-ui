import type { MqPickerValue } from '../mq-picker-view/types'

export interface MqColPickerOption {
  value: MqPickerValue
  label: string
  tip?: string
  disabled?: boolean
}

export interface MqColPickerColumnChangePayload {
  /** 当前列的选中项。自动补全时只有 `value` 字段。 */
  selectedItem: MqColPickerOption
  /** 当前列下标。 */
  index: number
  /** 当前列选中项下标。 */
  rowIndex: number
  /** 用下一列的选项继续选择；不传则结束。 */
  resolve: (options: MqColPickerOption[]) => void
  /** 结束选择。`finish(false)` 表示数据加载失败，不提交。 */
  finish: (ok?: boolean) => void
}

export type MqColPickerColumnChange = (payload: MqColPickerColumnChangePayload) => void | Promise<void>

export interface MqColPickerConfirmPayload {
  value: MqPickerValue[]
  selectedItems: MqColPickerOption[]
}

export interface MqColPickerProps {
  modelValue?: MqPickerValue[]
  /** 二维数组，每项是一列的选项。 */
  columns?: MqColPickerOption[][]
  /** 选中某一列后提供下一列数据，可异步。 */
  columnChange?: MqColPickerColumnChange
  label?: string
  title?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  displayFormat?: (selectedItems: MqColPickerOption[]) => string
  size?: 'normal' | 'large'
  labelWidth?: string
  error?: boolean
  required?: boolean
  alignRight?: boolean
  /** 确认前校验，返回 `false` 时留在面板里。 */
  beforeConfirm?: (value: MqPickerValue[], selectedItems: MqColPickerOption[]) => boolean | Promise<boolean>
  maskClosable?: boolean
  zIndex?: number
  /** `columns` 为空时自动用首列值触发 `columnChange` 补全数据。 */
  autoComplete?: boolean
  ellipsis?: boolean
}

export interface MqColPickerEmits {
  'update:modelValue': [value: MqPickerValue[]]
  confirm: [payload: MqColPickerConfirmPayload]
  close: []
}

export interface MqColPickerExpose {
  open: () => void
  close: () => void
}
