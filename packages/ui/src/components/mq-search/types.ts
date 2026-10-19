export interface MqSearchProps {
  modelValue?: string | number
  placeholder?: string
  disabled?: boolean
  maxlength?: number
  clearable?: boolean
  /** 右侧文字按钮。空字符串则不显示。 */
  actionText?: string
}

export interface MqSearchPayload {
  value: string
}

export interface MqSearchEmits {
  'update:modelValue': [value: string]
  input: [payload: MqSearchPayload]
  search: [payload: MqSearchPayload]
  clear: []
}
