export type MqInputType = 'text' | 'number' | 'digit' | 'idcard' | 'safe-password' | 'nickname' | 'tel'

export type MqInputConfirmType = 'done' | 'go' | 'next' | 'search' | 'send'

export interface MqInputProps {
  modelValue?: string | number
  type?: MqInputType
  placeholder?: string
  maxlength?: number
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  /** 在密码和明文之间切换，不使用图标字体。 */
  showPassword?: boolean
  /** 和 `maxlength` 一起用时显示字数。 */
  showWordLimit?: boolean
  error?: boolean
  alignRight?: boolean
  /** 去掉边框和内边距，方便放进单元格。 */
  compact?: boolean
  confirmType?: MqInputConfirmType
}

export interface MqInputPayload {
  value: string
}

export interface MqInputEmits {
  'update:modelValue': [value: string]
  input: [payload: MqInputPayload]
  focus: [payload: MqInputPayload]
  blur: [payload: MqInputPayload]
  clear: []
  confirm: [payload: MqInputPayload]
}
