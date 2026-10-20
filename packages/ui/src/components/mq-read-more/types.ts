export interface MqReadMoreProps {
  /** 直接传文本时使用；也可以用默认插槽。 */
  text?: string
  /** 收起后的最大高度（px），默认 120。 */
  maxHeight?: number
  expandText?: string
  collapseText?: string
  disabled?: boolean
  /** 是否始终显示展开按钮；不传时按文本长度或插槽自动判断。 */
  toggleable?: boolean
}

export interface MqReadMoreEmits {
  (e: 'change', expanded: boolean): void
}

export interface MqReadMoreExpose {
  toggle: () => void
  expand: () => void
  collapse: () => void
}
