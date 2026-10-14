export type MqButtonType = 'default' | 'primary' | 'success' | 'warning' | 'danger'

export type MqButtonSize = 'small' | 'medium' | 'large'

export interface MqButtonProps {
  type?: MqButtonType
  size?: MqButtonSize
  block?: boolean
  disabled?: boolean
}
