export type MqAvatarShape = 'round' | 'square'
export type MqAvatarSize = 'large' | 'medium' | 'normal' | 'small' | string | number

export interface MqAvatarProps {
  src?: string
  text?: string
  /** 文字标记，代替图标字体。 */
  mark?: string
  shape?: MqAvatarShape
  size?: MqAvatarSize
  bgColor?: string
  color?: string
  alt?: string
}

export interface MqAvatarEmits {
  (e: 'click', event: Event): void
}
