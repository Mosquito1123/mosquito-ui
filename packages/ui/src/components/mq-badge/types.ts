export type MqBadgeType = 'primary' | 'success' | 'warning' | 'danger'

export type MqBadgeShape = 'circle' | 'square'

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
}
