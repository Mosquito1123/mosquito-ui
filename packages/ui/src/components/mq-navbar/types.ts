export interface MqNavbarProps {
  title?: string
  leftText?: string
  rightText?: string
  /** 左侧显示文字箭头 ‹，不使用图标字体。 */
  leftArrow?: boolean
  bordered?: boolean
  fixed?: boolean
  /** 固定时是否生成等高占位。 */
  placeholder?: boolean
  safeAreaInsetTop?: boolean
  leftDisabled?: boolean
  rightDisabled?: boolean
  zIndex?: number
}

export interface MqNavbarEmits {
  'click-left': []
  'click-right': []
}
