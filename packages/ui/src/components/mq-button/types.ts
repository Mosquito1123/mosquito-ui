export type MqButtonType = 'default' | 'primary' | 'success' | 'warning' | 'danger'

export type MqButtonSize = 'small' | 'medium' | 'large'

export interface MqButtonProps {
  /** `default` | `primary` | `success` | `warning` | `danger` */
  type?: MqButtonType
  /** `small` | `medium` | `large` */
  size?: MqButtonSize
  /** 撑满父级宽度。 */
  block?: boolean
  /** 不可点，不发出 `click`。 */
  disabled?: boolean
  /** 进行中。不发出 `click`，并带 `aria-busy`。不额外加节点。 */
  loading?: boolean
}

export interface MqButtonEmits {
  click: [event: Event]
}
