export interface MqGridItemProps {
  text?: string
  /** 文字标记，代替图标字体。 */
  mark?: string
  ellipsis?: boolean
}

export interface MqGridItemEmits {
  (e: 'click', event: Event): void
}
