export type MqTagType = 'default' | 'primary' | 'success' | 'warning' | 'danger'

export type MqTagVariant = 'base' | 'plain' | 'light' | 'text'

export type MqTagSize = 'small' | 'medium' | 'large'

export interface MqTagProps {
  type?: MqTagType
  variant?: MqTagVariant
  size?: MqTagSize
  round?: boolean
  closable?: boolean
  /** 文字颜色。 */
  color?: string
  /** 实心时作背景，镂空时作边框。 */
  bgColor?: string
}

export interface MqTagEmits {
  close: [event: Event]
}
