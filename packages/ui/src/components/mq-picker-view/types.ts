import type {
  MqPickerColumn,
  MqPickerColumns,
  MqPickerOption,
  MqPickerValue,
} from '../../utils/picker'

export type { MqPickerColumn, MqPickerColumns, MqPickerOption, MqPickerValue }

export interface MqPickerChangePayload {
  selectedValues: MqPickerValue[]
  selectedOptions: MqPickerOption[]
  selectedLabels: string[]
  selectedIndexes: number[]
  /** 这次变化的列下标。级联时是父级所在列。 */
  columnIndex: number
}

export interface MqPickerViewProps {
  /** 选中值。单列为长度为 1 的数组，多列按列顺序。 */
  modelValue?: MqPickerValue[]
  /** 一维数组为单列，二维数组为多列；`cascade` 时传入树形数组。 */
  columns?: MqPickerColumns
  /** 级联模式，`columns` 传入带 `children` 的树。 */
  cascade?: boolean
  /** 每项高度，像素。 */
  itemHeight?: number
  /** 一屏可见项数。 */
  visibleItemCount?: number
  valueKey?: string
  labelKey?: string
  childrenKey?: string
  /** 手指松开就触发 `change`，不等滚动动画结束。 */
  immediateChange?: boolean
}

export interface MqPickerViewEmits {
  'update:modelValue': [value: MqPickerValue[]]
  change: [payload: MqPickerChangePayload]
  pickstart: []
  pickend: []
}

export interface MqPickerViewExpose {
  getSelectedOptions: () => MqPickerOption[]
  getSelectedValues: () => MqPickerValue[]
  getSelectedLabels: () => string[]
  getSelectedIndexes: () => number[]
  getSelectedIndex: () => number[]
  getColumnsData: () => MqPickerOption[][]
  getColumnData: (columnIndex: number) => MqPickerOption[]
  getColumnIndex: (columnIndex: number) => number
  getChangePayload: () => MqPickerChangePayload
  resetColumns: (columns: MqPickerColumns) => void
}
