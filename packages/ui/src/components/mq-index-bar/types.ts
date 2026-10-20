export interface MqIndexBarProps {
  sticky?: boolean
  highlightColor?: string
}

export interface MqIndexBarEmits {
  (e: 'select', index: string | number): void
  (e: 'change', index: string | number): void
}
