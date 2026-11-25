export interface MqActionSheetItem {
  name: string
  description?: string
  color?: string
  disabled?: boolean
  /** 显示加载中标记，并禁止选中。 */
  loading?: boolean
}

export interface MqActionSheetProps {
  modelValue?: boolean
  actions?: MqActionSheetItem[]
  title?: string
  /** 传空字符串则不显示取消。 */
  cancelText?: string
  /** 选中操作项后是否自动关闭。 */
  closeOnClickAction?: boolean
  maskClosable?: boolean
  duration?: number
  zIndex?: number
}

export interface MqActionSheetEmits {
  'update:modelValue': [value: boolean]
  select: [payload: { item: MqActionSheetItem; index: number }]
  cancel: []
  close: []
}
