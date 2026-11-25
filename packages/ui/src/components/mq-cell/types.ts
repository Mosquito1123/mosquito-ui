export type MqCellArrowDirection = 'left' | 'up' | 'down' | 'right'

export type MqCellValueAlign = 'left' | 'right' | 'center'

export type MqCellSize = 'normal' | 'large'

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
  /** 可点击时跳转到该地址：使用 `uni.navigateTo` 或 `uni.redirectTo`，同时仍发出 `click`。 */
  to?: string
  /** 跳转时使用 `uni.redirectTo` 替代 `uni.navigateTo`。 */
  replace?: boolean
  /** 箭头朝向：`left` | `up` | `down` | `right`。 */
  arrowDirection?: MqCellArrowDirection
  /** 垂直居中内容。 */
  center?: boolean
  /** 右侧说明的水平对齐方式。 */
  valueAlign?: MqCellValueAlign
  /** 标题宽度，数字按 px 处理。 */
  titleWidth?: string | number
  /** 单元格尺寸：`normal` | `large`。 */
  size?: MqCellSize
}

export interface MqCellEmits {
  click: [event: Event]
}
