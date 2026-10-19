export interface MqTextareaProps {
  modelValue?: string | number
  placeholder?: string
  /** 小于 0 表示不限制。会原样传给原生 textarea 的 -1。 */
  maxlength?: number
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  showWordLimit?: boolean
  error?: boolean
  /** 去掉边框和内边距，方便放进单元格。 */
  compact?: boolean
  /** 随内容增高。交给原生 textarea 的 auto-height。 */
  autoHeight?: boolean
}

export interface MqTextareaPayload {
  value: string
}

export interface MqTextareaEmits {
  'update:modelValue': [value: string]
  input: [payload: MqTextareaPayload]
  focus: [payload: MqTextareaPayload]
  blur: [payload: MqTextareaPayload]
  clear: []
  confirm: [payload: MqTextareaPayload]
}
