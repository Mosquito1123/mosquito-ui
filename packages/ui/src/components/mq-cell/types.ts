export interface MqCellProps {
  title?: string
  /** 右侧说明。数字 `0` 会显示；`null`、`undefined` 和空字符串不显示。 */
  value?: string | number | null
  /** 标题下方的一行说明。 */
  label?: string
  /** `value` 为空时显示的占位。 */
  placeholder?: string
  /** 显示箭头，并把根节点暴露成按钮。 */
  isLink?: boolean
  /** 没有箭头也显示按压态，并把根节点暴露成按钮。 */
  clickable?: boolean
  /** 不发出 `click`，也不显示按压态。 */
  disabled?: boolean
  /** 标题前显示必填星号。 */
  required?: boolean
  /** 底部分割线。 */
  border?: boolean
  /** 右侧说明过长时省略。 */
  ellipsis?: boolean
}

export interface MqCellEmits {
  click: [event: Event]
}
