export type MqBacktopShape = 'circle' | 'square'

export interface MqBacktopProps {
  scrollTop?: number
  text?: string
  top?: number
  duration?: number
  zIndex?: number
  shape?: MqBacktopShape
  bottom?: number
  right?: number
}

export interface MqBacktopEmits {
  (e: 'click', event: Event): void
}
