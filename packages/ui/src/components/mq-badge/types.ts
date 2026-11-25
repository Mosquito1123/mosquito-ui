export type MqBadgeType = 'primary' | 'success' | 'warning' | 'danger' | 'info'

export type MqBadgeShape = 'circle' | 'square' | 'bubble'

export interface MqBadgeProps {
  value?: string | number | null
  /** 超过后显示 `max+`。只对数字生效。 */
  max?: number
  /** 不显示数字，只显示一个点。 */
  isDot?: boolean
  /** `value` 为 0 时仍然显示。 */
  showZero?: boolean
  hidden?: boolean
  type?: MqBadgeType
  bgColor?: string
  shape?: MqBadgeShape
  /** 给徽标加一圈页面底色。 */
  border?: boolean
  /** 徽标相对右上角的纵向偏移；数字按 px。 */
  top?: string | number
  /** 徽标相对右上角的横向偏移；数字按 px。 */
  right?: string | number
}
