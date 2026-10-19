export type MqTextType = 'default' | 'primary' | 'success' | 'warning' | 'error'
export type MqTextMode = 'text' | 'price' | 'phone' | 'name'
export type MqTextDecoration = 'none' | 'underline' | 'line-through'

export interface MqTextProps {
  text?: string | number
  type?: MqTextType
  mode?: MqTextMode
  color?: string
  size?: string | number
  bold?: boolean
  lines?: number
  decoration?: MqTextDecoration
  prefix?: string
  suffix?: string
}

export interface MqTextEmits {
  (e: 'click', event: Event): void
}
