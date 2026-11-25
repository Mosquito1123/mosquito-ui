export type MqSelectPickerValue = string | number | undefined

export type MqSelectPickerOptionInput = string | number | Record<string, unknown>

export interface MqSelectPickerNormalizedOption {
  label: string
  value: MqSelectPickerValue
  disabled: boolean
  raw: MqSelectPickerOptionInput
}

export interface MqSelectPickerPayload {
  value: MqSelectPickerValue
  label: string
  option: MqSelectPickerOptionInput | undefined
}

export interface MqSelectPickerProps {
  /** 当前选中值，配合 `v-model`。 */
  modelValue?: MqSelectPickerValue
  /** 选项列表：字符串/数字，或带 `label`、`value`、`disabled` 的对象。 */
  options?: MqSelectPickerOptionInput[]
  /** 显隐，配合 `v-model:visible`。 */
  visible?: boolean
  title?: string
  /** 从对象选项中读取值的键名。 */
  valueKey?: string
  /** 从对象选项中读取文案的键名。 */
  labelKey?: string
  /** 禁用整个选择器。 */
  disabled?: boolean
  maskClosable?: boolean
  /** 面板底部是否留出安全区。 */
  safeArea?: boolean
}

export interface MqSelectPickerEmits {
  (e: 'update:modelValue', value: MqSelectPickerValue): void
  (e: 'update:visible', value: boolean): void
  (e: 'confirm', payload: MqSelectPickerPayload): void
  (e: 'change', payload: MqSelectPickerPayload): void
  (e: 'cancel'): void
  (e: 'open'): void
  (e: 'close'): void
}

export interface MqSelectPickerExpose {
  open: () => void
  close: () => void
}
