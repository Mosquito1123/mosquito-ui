export interface MqCellProps {
  title?: string
  /** 右侧说明。数字 `0` 会显示；`null`、`undefined` 和空字符串不显示。 */
  value?: string | number | null
  /** 显示箭头，并把根节点暴露成按钮。 */
  isLink?: boolean
  /** 不发出 `click`，也不显示按压态。 */
  disabled?: boolean
}

export interface MqCellEmits {
  click: [event: Event]
}
