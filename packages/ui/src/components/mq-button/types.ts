export type MqButtonType = 'default' | 'primary' | 'success' | 'warning' | 'danger'

export type MqButtonVariant = 'base' | 'plain' | 'text' | 'dashed' | 'soft' | 'subtle'

export type MqButtonSize = 'mini' | 'small' | 'medium' | 'large'

export interface MqButtonProps {
  /** `default` | `primary` | `success` | `warning` | `danger` */
  type?: MqButtonType
  /** `base` 实心，`plain` 镂空，`text` 无边框，`dashed` 虚线，`soft` 浅底，`subtle` 弱化。 */
  variant?: MqButtonVariant
  /** `mini` | `small` | `medium` | `large` */
  size?: MqButtonSize
  /** 胶囊圆角。 */
  round?: boolean
  /** 撑满父级宽度。 */
  block?: boolean
  /** 不可点，不发出 `click`。 */
  disabled?: boolean
  /** 进行中。不发出 `click`，并带 `aria-busy`。不额外加节点。 */
  loading?: boolean
  /** 叠加一条 1px 细描边，适合无边框变体。 */
  hairline?: boolean
}

export interface MqButtonEmits {
  click: [event: Event]
}
