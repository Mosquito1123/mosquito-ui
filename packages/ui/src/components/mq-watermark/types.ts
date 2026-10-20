export type MqWatermarkLayout = 'grid' | 'staggered'

export interface MqWatermarkProps {
  content?: string
  width?: number
  height?: number
  fullScreen?: boolean
  color?: string
  size?: number
  rotate?: number
  zIndex?: number
  opacity?: number
  layout?: MqWatermarkLayout
  gutterX?: number
  gutterY?: number
}
