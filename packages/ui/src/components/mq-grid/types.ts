export type MqGridDirection = 'vertical' | 'horizontal'

export interface MqGridProps {
  column?: number
  border?: boolean
  gutter?: number
  square?: boolean
  clickable?: boolean
  bgColor?: string
  center?: boolean
  direction?: MqGridDirection
}
