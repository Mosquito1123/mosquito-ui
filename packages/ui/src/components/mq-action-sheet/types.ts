export interface MqActionSheetItem {
  name: string
  description?: string
  color?: string
  disabled?: boolean
}

export interface MqActionSheetProps {
  modelValue?: boolean
  actions?: MqActionSheetItem[]
  title?: string
  /** 传空字符串则不显示取消。 */
  cancelText?: string
  maskClosable?: boolean
  duration?: number
  zIndex?: number
}

export interface MqActionSheetEmits {
  'update:modelValue': [value: boolean]
  select: [payload: { item: MqActionSheetItem; index: number }]
  close: []
}
