export type MqDialogBeforeConfirm = () => boolean | Promise<boolean | void> | void

export interface MqDialogProps {
  modelValue?: boolean
  title?: string
  message?: string
  /** 为 false 时只显示确认。 */
  showCancel?: boolean
  confirmText?: string
  cancelText?: string
  /** 确认前拦截。返回 false 或抛错时不关闭。 */
  beforeConfirm?: MqDialogBeforeConfirm
  maskClosable?: boolean
  duration?: number
  zIndex?: number
}

export interface MqDialogEmits {
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
  close: []
}
